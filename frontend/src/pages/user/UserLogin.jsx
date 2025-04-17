import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from '../../utils/commonStyles';
import { useAuth } from "../auth/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import logo from '../../assets/logo.webp';

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const referrer = location.state?.from || '/core/user/home';
      navigate(referrer, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password || !role) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const payload = {
      email,
      password,
      role,
    };

    try {
      // Set specific axios config for CORS with credentials
      const response = await axiosInstance.post(
        "/auth/login", 
        payload, 
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Critical for cookies
        }
      );

      const { token, user } = response.data;

      // Use the enhanced login function from AuthContext
      await login(token, user, 1); // 1 day expiry

      // Redirect based on role or previous location
      const referrer = location.state?.from;
      if (referrer) {
        navigate(referrer, { replace: true });
      } else if (role === "admin") {
        navigate("/core/admin/home", { replace: true });
      } else {
        navigate("/core/user/home", { replace: true });
      }
    } catch (error) {
      console.error("Login Failed:", error);
      
      // Provide a more specific error message based on the error type
      if (error.message === 'Network Error') {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(error.response?.data?.error || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Container style similar to signup page with responsive behavior
  const containerStyle = {
    ...styles.container,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    paddingTop: "70px", // Increased space for fixed header
    paddingBottom: "45px", // Increased space for fixed footer
    minHeight: "100vh",
    height: "auto", // Auto height to accommodate content
    position: "relative", // For proper stacking
    overflow: "auto", // Allow scrolling
  };

  // Button style that fits content
  const buttonStyle = {
    ...styles.button,
    padding: "10px 20px",
    width: "auto",
  };

  // Navbar style with overflow handling
  const navbarStyle = {
    ...styles.navbar,
    height: "auto", // Auto height to fit content
    minHeight: "60px", // Minimum height
    flexWrap: "wrap", // Allow wrapping
  };

  return (
    <div style={containerStyle}>
      {/* Fixed Header with navigation buttons */}
      <div style={navbarStyle}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("/")}>Home</button>
          <button style={styles.navButton} onClick={() => navigate("/core/login")}>Login</button>
          <button style={styles.navButton} onClick={() => navigate("/core/signup")}>Signup</button>
          <button style={styles.navButton} onClick={() => navigate("/core/contact")}>Contact</button>
        </div>
      </div>
      
      <div style={styles.form}>
        <h2 style={styles.heading}>Login to Your Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            autoFocus
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            style={styles.input}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} required style={styles.select}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{...styles.description, marginTop: "15px"}}>
          Don't have an account?{" "}
          <Link to="/core/signup" style={{color: "#225777", textDecoration: "none", fontWeight: "bold"}}>
            Sign up here
          </Link>
        </p>
      </div>
      
      {/* Fixed Footer */}
      <footer style={styles.footer}>
        © 2023 Kore Connect Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

export default UserLogin;
