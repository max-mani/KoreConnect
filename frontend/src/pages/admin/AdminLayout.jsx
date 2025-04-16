import { useNavigate } from "react-router-dom";
import styles from "../../utils/commonStyles";
import logo from '../../assets/logo.webp';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(`/core/admin/${path}`);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("sessionData");
    // Redirect to the home page
    navigate("/", { replace: true });
  };

  // Adjusted container style to match user layout
  const containerStyle = {
    ...styles.container,
    padding: 0,
    minHeight: "100vh",
    height: "100%",
    overflow: "hidden",
  };

  return (
    <div style={containerStyle}>
      {/* Header with navigation buttons */}
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap"}}>
          <button style={styles.dangerButton} onClick={() => navigateTo("home")}>Home</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("vendormenu")}>Menu</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("dashboard")}>Orders</button>
          <button style={styles.dangerButton} onClick={() => navigateTo("analytics")}>Analytics</button>
          <button
            onClick={handleLogout}
            style={styles.dangerButton}
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Content - directly render children without the empty main wrapper */}
      {children}
    </div>
  );
};

export default AdminLayout;
