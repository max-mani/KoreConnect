import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from '../../utils/commonStyles';
import { useAuth } from "../auth/AuthContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

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
    setDebugInfo(null);

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

    setDebugInfo({ message: "Attempting login with payload", payload });

    try {
      // Set specific axios config for CORS with credentials
      const response = await axios.post(
        "https://koreconnect.onrender.com/auth/login", 
        payload, 
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Critical for cookies
        }
      );

      setDebugInfo((prev) => ({ ...prev, response: response.data }));

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
      
      const errorResponse = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      };

      setDebugInfo((prev) => ({ ...prev, error: errorResponse }));
      
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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login to Your Account</h2>
      <form onSubmit={handleLogin} style={styles.form}>
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
        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>Don't have an account?</p>
      <button onClick={() => navigate("/core/signup")} style={styles.successButton}>
        Sign Up
      </button>

      {debugInfo && (
        <div style={{...styles.card, marginTop: "20px"}}>
          <h3 style={styles.subheading}>Debug Information</h3>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
