import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp';
import styles from '../../utils/commonStyles';
import { useAuth } from "../auth/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
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
      {/* Fixed Navbar */}
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
      <div style={styles.mainContent}>
        <h2 style={{...styles.heading, marginTop: "5px", marginBottom: "10px"}}>Welcome to Kore Connect</h2>
        <p style={{...styles.description, marginBottom: "15px"}}>
          The premier food ordering platform! Explore our canteen menu, 
          order your favorite meals, and savor the taste of convenience 
          right here at your campus.
        </p>
        <button style={{...styles.button, maxWidth: "200px"}} onClick={() => 
          isAuthenticated 
            ? (user?.role === 'admin' ? navigate("/core/admin/home") : navigate("/core/user/home"))
            : navigate("/core/login")
        }>
          {isAuthenticated ? "Go to Dashboard" : "Order Now"}
        </button>
      </div>

      {/* Fixed Footer */}
      <footer style={styles.footer}>
        © 2023 Kore Connect Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;