import { useNavigate } from "react-router-dom";
import styles from "../../utils/commonStyles";
import logo from '../../assets/logo.webp';

const UserLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    sessionStorage.clear();
    // Redirect to the home page
    navigate("/core/home", { replace: true });
    // Prevent back navigation
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", function () {
      navigate("/core/home", { replace: true });
    });
  };

  const navigateTo = (path) => {
    navigate(`/core/user/${path}`);
  };

  // Adjusted container style to eliminate empty space
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
      
      {/* Content - directly render children without the empty main wrapper */}
      {children}
    </div>
  );
};

export default UserLayout;