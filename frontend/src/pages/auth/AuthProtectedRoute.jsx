import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    const verifySession = async () => {
      setIsVerifying(true);
      
      // First check if we have auth data in local storage
      const token = localStorage.getItem("token");
      const sessionData = localStorage.getItem("sessionData");
      
      if (!token || !sessionData) {
        // No token or session, definitely not authenticated
        setIsValid(false);
        setIsVerifying(false);
        return;
      }
      
      try {
        // Verify the token with the backend to confirm it's still valid
        const response = await axios.post(
          "http://localhost:5000/auth/verify-token", 
          { currentPath: location.pathname }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            withCredentials: true // Include cookies
          }
        );
        
        if (response.data.valid) {
          // Backend confirmed token is valid
          setIsValid(true);
        } else {
          // Token invalid according to backend
          console.log("Token invalid according to backend");
          // Force a re-check of auth context
          await checkAuthStatus();
          setIsValid(false);
        }
      } catch (error) {
        console.error("Session verification error:", error);
        // Error during verification, assume not authenticated
        setIsValid(false);
        
        // Force a re-check of auth context
        await checkAuthStatus();
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifySession();
  }, [location.pathname, checkAuthStatus]);
  
  // Show loading state while checking
  if (isLoading || isVerifying) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f5f5f7'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #e0e0e0',
          borderTopColor: '#3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <p style={{ marginTop: '20px', color: '#333' }}>Verifying your session...</p>
      </div>
    );
  }
  
  // If authentication check is complete and user is not authenticated, redirect to login
  if (!isAuthenticated || !isValid) {
    return <Navigate to="/core/login" replace state={{ from: location.pathname }} />;
  }
  
  // If authenticated and verification complete, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
