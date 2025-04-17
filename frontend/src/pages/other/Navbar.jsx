import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated); // Use isAuthenticated from AuthContext
  }, [isAuthenticated]);

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      await logout(); // Use the central logout function which now handles navigation
      setIsLoggedIn(false);
    } else {
      navigate("/core/login"); // Redirect to login page
    }
  };

  return (
    <nav style={{ padding: "10px", textAlign: "right" }}>
      <button onClick={handleAuthAction}>
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </nav>
  );
}

export default Navbar;
