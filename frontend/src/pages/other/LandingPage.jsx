import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp';
import styles from '../../utils/commonStyles';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Kore Connect Logo" style={styles.logo} />
          <h1 style={styles.brandName}>Kore Connect</h1>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navButton} onClick={() => navigate("/core/home")}>Home</button>
          <button style={styles.navButton} onClick={() => navigate("/core/login")}>Login</button>
          <button style={styles.navButton} onClick={() => navigate("/core/signup")}>Signup</button>
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
        <button style={{...styles.button, maxWidth: "200px"}} onClick={() => navigate("/core/login")}>
          Order Now
        </button>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        © 2023 Kore Connect Food Ordering System. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;