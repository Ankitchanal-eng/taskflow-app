import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const hasToken = !!localStorage.getItem('token');

  // If already logged in, go straight to dashboard
  if (hasToken) {
    navigate('/dashboard');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ marginBottom: '10px', color: '#333' }}>Welcome to TaskFlow</h1>
      <p style={{ marginBottom: '30px', color: '#666', textAlign: 'center' }}>
        Manage your tasks securely. Please register or log in to continue.
      </p>

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '10px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
        >
          Register
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '10px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Login
        </button>
      </div>
    </div>
  );
}
