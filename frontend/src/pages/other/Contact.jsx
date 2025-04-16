import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Contact = () => {
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

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src="/logo.png" alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("/home")}>Home</button>
          <button style={styles.navButton} onClick={() => navigate("/menu")}>Menu</button>
          <button style={styles.navButton} onClick={() => navigate("/contact")}>Contact</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.heading}>Contact Us</h2>
        <p style={styles.description}>
          Have questions or feedback? We'd love to hear from you! Fill out the form below, 
          and we'll get back to you as soon as possible.
        </p>

        {/* Contact Form */}
        <form style={styles.contactForm} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>Name</label>
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
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
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
          <div style={styles.formGroup}>
            <label htmlFor="message" style={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>
          <button type="submit" style={styles.submitButton}>Submit</button>
        </form>

        {/* Contact Information */}
        <div style={styles.contactInfo}>
          <h3 style={styles.infoHeading}>Contact Information</h3>
          <p style={styles.infoText}>
            <strong>Email:</strong> koresupport@kct.ac.in
          </p>
          <p style={styles.infoText}>
            <strong>Phone:</strong> +91 123 456 7890
          </p>
          <p style={styles.infoText}>
            <strong>Address:</strong> Kumaraguru Campus, Saravanampatti, Coimbatore, Tamil Nadu 641049
          </p>
        </div>

        {/* Map */}
        <div style={styles.mapContainer}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.123456789012!2d76.9862419!3d11.0786056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f76dcc0d0567%3A0xff1477e12ef6cb8c!2sKORE!5e0!3m2!1sen!2sin!4v1631234567890!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={styles.map}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2025 Kore. All rights reserved.
      </footer>
    </div>
  );
};

// Styles
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#F9F7F7", // Lightest color for the background
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#112D4E", // Darkest color for the navbar
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  brandName: {
    color: "#FFFFFF", // White text for contrast
    fontSize: "22px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navButton: {
    background: "transparent",
    border: "none",
    color: "#FFFFFF", // White text for contrast
    fontSize: "16px",
    cursor: "pointer",
    textTransform: "capitalize",
    fontWeight: "bold",
    transition: "color 0.3s ease",
    ":hover": {
      color: "#DBE2EF", // Medium color on hover
    },
  },
  mainContent: {
    padding: "50px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "left",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#112D4E", // Darkest color for the heading
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    color: "#3F72AF", // Medium-dark color for the description
    marginBottom: "40px",
  },
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
    color: "#112D4E", // Darkest color for the label
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #DBE2EF", // Medium color for the border
    fontSize: "16px",
    backgroundColor: "#FFFFFF", // White background for the input
    color: "#112D4E", // Darkest color for the text
  },
  textarea: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #DBE2EF", // Medium color for the border
    fontSize: "16px",
    backgroundColor: "#FFFFFF", // White background for the textarea
    color: "#112D4E", // Darkest color for the text
    minHeight: "150px",
  },
  submitButton: {
    padding: "12px 25px",
    fontSize: "18px",
    backgroundColor: "#3F72AF", // Medium-dark color for the button
    color: "#FFFFFF", // White text for contrast
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    ":hover": {
      backgroundColor: "#112D4E", // Darkest color on hover
    },
  },
  contactInfo: {
    marginBottom: "40px",
  },
  infoHeading: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#112D4E", // Darkest color for the heading
    marginBottom: "20px",
  },
  infoText: {
    fontSize: "16px",
    color: "#3F72AF", // Medium-dark color for the text
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
  footer: {
    padding: "15px",
    background: "#112D4E", // Darkest color for the footer
    color: "#FFFFFF", // White text for contrast
    fontSize: "14px",
    boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default Contact;
