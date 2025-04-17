import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from '../../utils/commonStyles';
import logo from '../../assets/logo.webp';
import { useAuth } from "../auth/AuthContext";

const Contact = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  // Container style to match landing page
  const containerStyle = {
    ...styles.container,
    padding: 0,
    minHeight: "100vh",
    height: "auto", // Auto height to accommodate content
    paddingTop: "70px", // Increased space for fixed header
    paddingBottom: "45px", // Increased space for fixed footer
    position: "relative", // For proper stacking
    overflow: "auto", // Allow scrolling
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
      {/* Navbar */}
      <div style={navbarStyle}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("/core/home")}>Home</button>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <button style={styles.navButton} onClick={() => navigate("/core/admin/home")}>Dashboard</button>
              ) : (
                <button style={styles.navButton} onClick={() => navigate("/core/user/home")}>Dashboard</button>
              )}
              <button style={styles.navButton} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button style={styles.navButton} onClick={() => navigate("/core/login")}>Login</button>
              <button style={styles.navButton} onClick={() => navigate("/core/signup")}>Signup</button>
            </>
          )}
          
          <button style={styles.navButton} onClick={() => navigate("/core/contact")}>Contact</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        padding: "50px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "left",
      }}>
        <h2 style={styles.heading}>Contact Us</h2>
        <p style={styles.description}>
          Have questions or feedback? We'd love to hear from you! Fill out the form below, 
          and we'll get back to you as soon as possible.
        </p>

        {/* Contact Form */}
        <form style={customStyles.contactForm} onSubmit={handleSubmit}>
          <div style={customStyles.formGroup}>
            <label htmlFor="name" style={customStyles.label}>Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={customStyles.formGroup}>
            <label htmlFor="email" style={customStyles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={customStyles.formGroup}>
            <label htmlFor="message" style={customStyles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={customStyles.textarea}
              required
            />
          </div>
          <button type="submit" style={{...styles.button, width: "auto", padding: "12px 25px"}}>Submit</button>
        </form>

        {/* Contact Information */}
        <div style={customStyles.contactInfo}>
          <h3 style={customStyles.infoHeading}>Contact Information</h3>
          <p style={customStyles.infoText}>
            <strong>Email:</strong> koresupport@kct.ac.in
          </p>
          <p style={customStyles.infoText}>
            <strong>Phone:</strong> +91 123 456 7890
          </p>
          <p style={customStyles.infoText}>
            <strong>Address:</strong> Kumaraguru Campus, Saravanampatti, Coimbatore, Tamil Nadu 641049
          </p>
        </div>

        {/* Map */}
        <div style={customStyles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123456789012!2d76.9862419!3d11.0786056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f76dcc0d0567%3A0xff1477e12ef6cb8c!2sKORE!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={customStyles.map}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2023 Kore Connect Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

// Custom styles for Contact page-specific elements
const customStyles = {
  contactForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "40px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  textarea: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "16px",
    backgroundColor: "#FFFFFF",
    color: "#333",
    minHeight: "150px",
  },
  contactInfo: {
    marginBottom: "40px",
  },
  infoHeading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  infoText: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "10px",
  },
  mapContainer: {
    marginBottom: "40px",
  },
  map: {
    border: "none",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

export default Contact;
