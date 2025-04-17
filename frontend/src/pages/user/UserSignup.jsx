import { useState } from "react";
import axios from "../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import styles from '../../utils/commonStyles';

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    role: "",
  });

  const [error, setError] = useState(null); // State for error messages
  const { name, email, password, phone, city, state, role } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      const response = await axios.post("/auth/signup", { name, email, password, phone, city, state, role });
      alert(response.data.message);
      navigate("/login");  
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Something went wrong.");
    }
  };

  const containerStyle = {
    ...styles.container,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #ff6f61, #ff9671)",
    padding: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={styles.form}>
        <h2 style={styles.heading}>Create Your Account</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={onChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={state}
            onChange={onChange}
            required
            style={styles.input}
          />
          <select name="role" value={role} onChange={onChange} required style={styles.select}>
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
        <p style={{...styles.description, marginTop: "15px"}}>
          Already have an account?{" "}
          <Link to="/login" style={{color: "#ff6f61", textDecoration: "none", fontWeight: "bold"}}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
