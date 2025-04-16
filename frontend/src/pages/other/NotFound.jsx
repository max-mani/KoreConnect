const NotFound = () => {
    return (
      <div style={styles.container}>
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    );
  };
  
  const styles = {
    container: {
      textAlign: "center",
      padding: "50px",
      fontSize: "20px",
    },
  };
  
  export default NotFound;
  