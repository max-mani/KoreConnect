import { useState, useEffect } from "react";
import Layout from "./UserLayout";
import styles from "../../utils/commonStyles";

const UserDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [todaySpecial, setTodaySpecial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/menus/getmenu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();

        // Shuffle and select random menu items
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selectedItems = shuffled.slice(0, 3);
        setMenuItems(selectedItems);

        // Select a random item for Today's Special
        setTodaySpecial(shuffled[0] || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Fallback placeholder image URL
  const placeholderImage = "https://via.placeholder.com/300x200?text=Image+Placeholder";

  // Function to construct the image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return placeholderImage;
    // Check if imageUrl is already a full URL
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    // If it's a relative path, prepend the base URL
    return `http://localhost:5000${imageUrl}`;
  };

  // Custom styles that extend common styles
  const customStyles = {
    contentContainer: {
      padding: "15px",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    },
    specialCard: {
      ...styles.card,
      maxWidth: "400px",
      margin: "0 auto",
    },
    specialImage: {
      ...styles.cardImage,
      height: "150px",
    },
    menuContainer: {
      ...styles.grid,
      maxWidth: "960px", 
      margin: "0 auto",
    },
    menuCard: {
      ...styles.card,
      width: "300px",
    },
    loadingText: {
      fontSize: "18px",
      color: "#6e6e73",
      marginTop: "20px",
    },
  };

  return (
    <Layout>
      {/* Main content wrapped in custom container */}
      <div style={customStyles.contentContainer}>
        <h1 style={{...styles.heading, marginTop: "10px"}}>Welcome to Our Menu</h1>
        <p style={styles.description}>Explore our selection of delicious meals and daily specials.</p>

        {/* Today's Special Section */}
        <h2 style={styles.subheading}>Today's Special</h2>
        {loading ? (
          <p style={customStyles.loadingText}>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : todaySpecial ? (
          <div style={customStyles.specialCard}>
            <img
              src={getImageUrl(todaySpecial.imageUrl)}
              alt={todaySpecial.name}
              style={customStyles.specialImage}
              onError={(e) => (e.target.src = placeholderImage)}
            />
            <h3 style={styles.subheading}>{todaySpecial.name}</h3>
            <p style={styles.description}>₹{todaySpecial.price.toFixed(2)}</p>
          </div>
        ) : (
          <p style={styles.error}>No special item available today.</p>
        )}

        {/* Menu Section */}
        <h2 style={styles.subheading}>Explore Our Menu</h2>
        {loading ? (
          <p style={customStyles.loadingText}>Loading...</p>
        ) : error ? (
          <p style={styles.error}>{error}</p>
        ) : menuItems.length > 0 ? (
          <div style={customStyles.menuContainer}>
            {menuItems.map((item) => (
              <div key={item._id} style={customStyles.menuCard}>
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                  style={styles.cardImage}
                  onError={(e) => (e.target.src = placeholderImage)}
                />
                <h3 style={styles.subheading}>{item.name}</h3>
                <p style={styles.description}>₹{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.error}>No menu items available.</p>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;