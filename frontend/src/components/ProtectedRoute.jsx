// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (allowedRoles.length > 0 && user) {
        if (!allowedRoles.includes(user.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
}