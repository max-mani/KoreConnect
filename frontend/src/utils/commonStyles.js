// Common styles to be used across the application
const commonStyles = {
  // Layout containers
  container: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
    maxWidth: "100%",
    overflow: "auto",
    boxSizing: "border-box",
    position: "relative",
  },
  mainContent: {
    padding: "20px",
    maxWidth: "100%",
    margin: "0 auto",
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    overflow: "auto",
    marginTop: "60px",
    marginBottom: "50px",
  },
  
  // Navbar styling
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    background: "#225777",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    width: "100%",
    boxSizing: "border-box",
    flexWrap: "wrap",
    minHeight: "60px",
    height: "auto",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    padding: "3px",
  },
  logo: {
    width: "45px",
    height: "45px",
    objectFit: "contain",
    border: "2px solid black",
    borderRadius: "5px",
    padding: "2px",
    backgroundColor: "white",
  },
  brandName: {
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
  },
  navLinks: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "5px 0",
    justifyContent: "flex-end",
  },
  navButton: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    padding: "8px 12px",
    transition: "all 0.2s ease",
    margin: "2px",
  },
  
  // Footer styling
  footer: {
    padding: "10px 15px",
    background: "#225777",
    color: "white",
    fontSize: "14px",
    textAlign: "center",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    minHeight: "35px",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  
  // Typography
  heading: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  subheading: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "15px",
  },
  description: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  
  // Forms
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    transition: "border 0.3s ease",
  },
  select: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  
  // Buttons
  button: {
    width: "100%",
    padding: "12px 15px",
    backgroundColor: "#225777",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  secondaryButton: {
    padding: "10px 15px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  dangerButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  successButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
  },
  
  // Cards
  card: {
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    margin: "15px 0",
    transition: "transform 0.2s ease",
  },
  cardImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  
  // Grids
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
    gap: "20px",
    width: "100%",
  },
  
  // Utility styles
  flexRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  error: {
    color: "#dc3545",
    fontWeight: "bold",
    marginTop: "10px",
  },
  success: {
    color: "#28a745",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default commonStyles; 