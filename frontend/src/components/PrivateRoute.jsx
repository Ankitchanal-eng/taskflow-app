import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    // local storage me token check krega h k nhi
    const token = localStorage.getItem('token');
    // check urse is authorized or not
    const isAuthenticated = !!token // '!!' converts the token value to a boolean (true if token exists)
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;