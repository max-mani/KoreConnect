import { useNavigate } from "react-router-dom";
import styles from "../../utils/commonStyles";
import logo from '../../assets/logo.webp';
import { useAuth } from "../auth/AuthContext";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    // Use the central logout function from AuthContext which now handles navigation
    await logout();
  };

  const navigateTo = (path) => {
    navigate(`/core/user/${path}`);
  };

  // Adjusted container style to accommodate fixed header and footer with responsive behavior
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
      {/* Fixed Header with navigation buttons */}
      <div style={navbarStyle}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"}}>
          <button style={styles.dangerButton} onClick={() => navigateTo("home")}>Home</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("profile")}>Profile</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("menu")}>Menu</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("cart")}>Cart</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("order-tracking")}>Track Orders</button>
          <button
            onClick={handleLogout}
            style={styles.dangerButton}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Content */}
      {children}
      
      {/* Fixed Footer */}
      <footer style={styles.footer}>
        © 2023 Kore Connect Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

export default UserLayout;