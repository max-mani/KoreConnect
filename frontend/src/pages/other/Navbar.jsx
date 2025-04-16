import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token")); // Check token on component mount
  }, []);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token"); // Remove token
      setIsLoggedIn(false);
      navigate("/"); // Redirect to home page
    } else {
      navigate("/login"); // Redirect to login page
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
