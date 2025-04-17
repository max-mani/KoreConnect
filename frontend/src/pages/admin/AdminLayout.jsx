import { useNavigate } from "react-router-dom";
import styles from "../../utils/commonStyles";
import logo from '../../assets/logo.webp';
import { useAuth } from "../auth/AuthContext";
import { throttledNavigate } from "../../utils/navigationUtils";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navigateTo = (path) => {
    // Clear any tab selection when navigating to other paths
    sessionStorage.removeItem('menuTab');
    
    // Use throttled navigation to prevent flooding
    throttledNavigate(navigate, `/core/admin/${path}`);
  };

  const handleLogout = async () => {
    // Prevent multiple logout attempts
    if (sessionStorage.getItem('isLoggingOut') === 'true') {
      return;
    }
    
    // Use the central logout function from AuthContext which now handles navigation
    await logout();
  };

  // Container style - adjusted to accommodate fixed header and footer
  const containerStyle = {
    ...styles.container,
    padding: 0,
    minHeight: "100vh",
    paddingTop: "70px", // Space for fixed header
    paddingBottom: "45px", // Space for fixed footer
    position: "relative",
    overflow: "auto", // Main scrolling here
  };

  // Fixed header style
  const headerStyle = {
    ...styles.navbar,
    height: "auto", 
    minHeight: "60px",
    position: "fixed", // Fixed position
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "auto", // Horizontal scroll if needed
    overflowY: "hidden", // No vertical scroll
  };

  // Content wrapper style - centered with proper width
  const contentWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    flex: 1,
    overflow: "visible", // No scrolling in the wrapper itself
  };

  // Fixed footer style
  const footerStyle = {
    ...styles.footer,
    position: "fixed", 
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    boxShadow: "0 -2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div style={containerStyle}>
      {/* Fixed Header */}
      <div style={headerStyle}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigateTo("home")}>Dashboard</button>
          <button style={styles.navButton} onClick={() => navigateTo("addmenu")}>Add Menu</button>
          <button style={styles.navButton} onClick={() => navigateTo("viewmenu")}>View Menu</button>
          <button style={styles.navButton} onClick={() => navigateTo("orders")}>Orders</button>
          <button style={styles.navButton} onClick={() => navigateTo("analytics")}>Analytics</button>
          <button
            onClick={handleLogout}
            style={styles.navButton}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Content centered in the page */}
      <div style={contentWrapperStyle}>
        {children}
      </div>
      
      {/* Fixed Footer */}
      <footer style={footerStyle}>
        © 2025 Kore Connect Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminLayout;
