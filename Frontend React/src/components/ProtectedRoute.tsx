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




// import { JSX, useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// interface ProtectedRouteProps {
//   children: JSX.Element;
//   requiredRole?: string; // Optional role prop
// }

// interface DecodedToken {
//   Authorities: string;
// }

// const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [hasRequiredRole, setHasRequiredRole] = useState(true);
//   const [loading, setLoading] = useState(true); // New loading state
//   console.log("rendering ProtectedRoute");
  

//   useEffect(() => {
//     console.log("running useEffect");
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token) as DecodedToken;
//         console.log("check auth success");

//         setIsAuthenticated(true);
//         if (requiredRole) {
//           setHasRequiredRole(decoded.Authorities === requiredRole);
//         }
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         setIsAuthenticated(false);
//       }
//     }
//     setLoading(false); // Set loading to false after processing
//   }, [requiredRole]);

//   if (loading) {
//     return null; // Render nothing or a loading spinner while loading
//   }

//   if (!isAuthenticated) {
//     console.log("not authen", isAuthenticated);
//     return <Navigate to="/" replace />;
//   }

//   if (requiredRole && !hasRequiredRole) {
//     console.log("not having the  RequiredRole ");
//     return <Navigate to="/home" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

