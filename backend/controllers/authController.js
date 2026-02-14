const User = require('../models/user'); // Import the User Model you created
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- REGISTER USER ---
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // 1. Check if user already exists
        let user = await User.findOne({email});
        if (user){
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create a new User instance
        user = new User ({
            username,
            email,
            password  // Password will be hashed before saving
        });

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Save the user to the database
        await user.save();

        // 5. Create the JWT Payload
        const payload = {
            user: {
                id: user.id  // Mongoose automatically creates a unique ID
            }
        };

        // 6. Sign the JWT and send it back
        console.log("Secret used for signing:", process.env.JWT_SECRET);
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h'},  // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ token });   // Send back the token for the client to store
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during registration');
    }
};

// --- LOGIN USER ---
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // 2. Compare entered password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid Credentials "});
        }

        // 3. Create the JWT Payload (same as register)
        const payload = {
            user: {
                id: user.id
            }
        };

        // 4. Sign the JWT and send it back
        console.log("Secret used for signing:", process.env.JWT_SECRET); // <--- ADDED DEBUG LOG HERE
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error during login');
    }
};