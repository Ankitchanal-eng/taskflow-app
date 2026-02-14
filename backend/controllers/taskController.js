const Task = require('../models/Task');

//Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
    try {
        // Ensure tasks belong to the user and sort by creation date
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (err) {
        // Use 401/403 if error is related to authentication/authorization failure
        res.status(500).json({ message: 'Server Error: Could not fetch tasks.' });
    }
};


// Create a new task
exports.createTask = async (req, res) => {
    try {
        console.log("BODY RECEIVED BY BACKEND:", req.body);
        console.log("USER FROM PROTECT:", req.user);
        const { title, description, status } = req.body;

        // FIX 1: Add explicit validation to handle missing 'title' from frontend.
        // This prevents the 400 error you were seeing.
        if (!title) {
            return res.status(400).json({ message: 'Title is required to create a task.' });
        }

        const task = new Task ({
            title,
            description,
            // Status will use the Mongoose default if not provided
            status,
            user: req.user.id,  // Automatically assign the authenticated user's ID
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
        
    } catch (err) {
        // FIX 2: Mongoose validation errors often use status 400, but let's be more specific
        // If it's a validation error (like status not being valid), err.message is used.
        res.status(400).json({ message: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // SECURITY CHECK: Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this task'});
        }

        // Only update fields that are provided in the request body (req.body)
        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return the updated document
            runValidators: true, // run Mongoose validators on update
        });

        res.status(200).json(task);
    } catch (err) {
        // Use 400 for errors like bad input or Mongoose validation failure
        res.status(400).json({ message: err.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            // FIX 3: Added 'return' here to stop execution immediately after sending 404
            return res.status(404).json({ message: 'Task not found' }); 
        }

        // SECURITY CHECK: Ensure the task belongs to the authenticated user
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Task removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error: Could not delete task.' });
    }
};