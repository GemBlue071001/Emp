import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    Authorities: string;
    userId: string;
    jti: string;
    nbf: number;
    exp: number;
    iss: string;
    aud: string;
}

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const location = useLocation();
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded); // For debugging
        
        if (requiredRole && decoded.Authorities !== requiredRole) {
            return <Navigate to="/home" replace />;
        }

        return <>{children}</>;
    } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('accessToken');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default ProtectedRoute;
