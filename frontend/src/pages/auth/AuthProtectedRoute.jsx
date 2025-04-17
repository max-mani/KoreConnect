import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { isNavigationInProgress } from "../../utils/navigationUtils";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    // Only show verification loading state on first load
    if (isInitialLoad) {
      setIsVerifying(true);
      setIsInitialLoad(false);
      verifySession();
    } else {
      // For subsequent route changes, verify without showing loading state
      verifySession(false);
    }
    
    async function verifySession(showLoading = true) {
      if (showLoading) {
        setIsVerifying(true);
      }
      
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
        const response = await axiosInstance.post(
          "/auth/verify-token", 
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
    }
  }, [location.pathname, checkAuthStatus]);
  
  // Show loading state while checking, but only on initial load
  if ((isLoading && isInitialLoad) || isVerifying) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ 
          position: 'relative',
          width: '80px',
          height: '80px',
          marginBottom: '20px'
        }}>
          {/* Outer spinning circle */}
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: '#ff5722',
            borderRadius: '50%',
            animation: 'spin 1s ease-in-out infinite'
          }} />
          
          {/* Inner spinning circle (opposite direction) */}
          <div style={{ 
            position: 'absolute',
            top: '15px',
            left: '15px',
            width: '50px',
            height: '50px',
            border: '4px solid rgba(0, 0, 0, 0.1)',
            borderTopColor: '#2196f3',
            borderRadius: '50%',
            animation: 'spin-reverse 1.2s linear infinite'
          }} />
        </div>
        <h3 style={{ 
          color: '#333', 
          marginBottom: '5px',
          fontWeight: 'bold'
        }}>
          Please wait
        </h3>
        <p style={{ 
          color: '#666',
          fontSize: '15px'
        }}>
          Securely authenticating your session...
        </p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes spin-reverse {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(-360deg); }
            }
          `}
        </style>
      </div>
    );
  }
  
  // If authentication check is complete and user is not authenticated, redirect to login
  if (!isAuthenticated || !isValid) {
    // Check if we're in the middle of a logout process
    const isLoggingOut = sessionStorage.getItem('isLoggingOut');
    
    // Also check if navigation is in progress
    const navInProgress = isNavigationInProgress();
    
    // If we're currently logging out or navigating elsewhere, don't redirect to login
    if (isLoggingOut === 'true' || navInProgress) {
      // Return null (nothing) while logout or navigation is in progress
      return null;
    }
    
    return <Navigate to="/core/login" replace state={{ from: location.pathname }} />;
  }
  
  // If authenticated and verification complete, render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
