import React, { useState } from 'react';
import api from '../api/axios'; // ✅ Import the configured api instance
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            // ✅ FIXED: Use api instance instead of hardcoded localhost
            const res = await api.post('/api/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');

        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            setError(msg);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
}
