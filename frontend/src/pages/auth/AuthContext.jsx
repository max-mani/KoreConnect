import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  // Function to validate the token with the backend
  const validateToken = async (token) => {
    if (!token) return false;
    
    try {
      // Call the backend to validate the token
      const response = await axiosInstance.post(
        "/auth/verify-token", 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true // Include cookies
        }
      );
      
      return response.data.valid;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };
  
  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const sessionData = localStorage.getItem("sessionData");
      
      if (!token || !sessionData) {
        handleLogout();
        return;
      }
      
      try {
        const session = JSON.parse(sessionData);
        
        if (!session || !session.userId || !session.expiresAt) {
          handleLogout();
          return;
        }
        
        // Check if session has expired
        const expiresAt = new Date(session.expiresAt);
        const now = new Date();
        
        if (now >= expiresAt) {
          console.log("Session expired");
          handleLogout();
          return;
        }
        
        // Verify token with backend
        const isValid = await validateToken(token);
        
        if (!isValid) {
          console.log("Token invalid");
          handleLogout();
          return;
        }
        
        setUser(session);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing session data:", error);
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = (callback) => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionData");
    localStorage.removeItem("authToken");
    
    // Clear cookies
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Clear session storage
    sessionStorage.clear();
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);

    // Execute callback if provided
    if (typeof callback === 'function') {
      callback();
    }
  };
  
  useEffect(() => {
    checkAuthStatus();
    
    // Set up periodic check (every 30 seconds)
    const intervalId = setInterval(checkAuthStatus, 30000);
    
    // Check auth on window focus
    const handleFocus = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Listen for storage events (like another tab changing localStorage)
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  const login = async (token, userData, expiryDays = 1) => {
    // Set token in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userData.id);
    
    // Set expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    
    // Create session data
    const sessionData = {
      userId: userData.id,
      role: userData.role,
      name: userData.name,
      email: userData.email,
      loggedInAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    };
    
    // Store session data
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
    
    // Set cookie for additional security
    document.cookie = `auth=${token}; expires=${expiresAt.toUTCString()}; path=/; secure; samesite=strict`;
    
    setUser(sessionData);
    setIsAuthenticated(true);
    
    // Register this session with backend
    try {
      await axiosInstance.post(
        "/auth/register-session",
        { userId: userData.id, expiresAt: expiresAt.toISOString() },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error("Failed to register session:", error);
      // Continue anyway as we have local auth
    }
  };
  
  const logout = async () => {
    const token = localStorage.getItem("token");
    
    // Try to invalidate session on backend
    if (token) {
      try {
        await axiosInstance.post(
          "/auth/logout",
          {},
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            withCredentials: true
          }
        );
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
    
    // Clear all authentication data locally and navigate to home
    handleLogout(() => {
      navigate("/", { replace: true });
    });
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      user,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 