import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./UserLayout";
import styles from "../../utils/commonStyles";

const categories = ["All", "Vegetarian", "Non-Vegetarian", "Desserts"];

const UserMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/menus/getmenu")
      .then((response) => setMenuItems(response.data))
      .catch((error) => console.error("Error fetching menu data:", error));
  }, []);

  const getImageUrl = (imageUrl) =>
    imageUrl.startsWith("http") ? imageUrl : `http://localhost:5000${imageUrl}`;

  const handleQuantityChange = (itemId, delta) => {
    setQuantities((prevQuantities) => {
      const newQuantity = (prevQuantities[itemId] || 0) + delta;
      return newQuantity > 0
        ? { ...prevQuantities, [itemId]: newQuantity }
        : prevQuantities;
    });
  };

  const addToCart = async (itemId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in first.");
        return;
      }

      // Get the selected quantity, defaulting to 1 if not set
      const quantity = quantities[itemId] || 1;
      
      console.log(`Adding ${quantity} of item ${itemId} to cart`); // Debug log
      
      // Ensure itemId is a valid ID
      if (!itemId) {
        console.error("Invalid itemId:", itemId);
        alert("Invalid item. Please try again.");
        return;
      }
      
      const requestData = {
        userId,
        itemId: itemId.toString(), // Ensure itemId is a string
        quantity: parseInt(quantity) // Ensure quantity is a number
      };
      
      console.log("Sending add to cart request:", requestData);
      
      const response = await axios.post("http://localhost:5000/cart/add", requestData);

      console.log("Add response:", response.data);

      // Reset quantity after adding to cart
      setQuantities(prev => ({
        ...prev,
        [itemId]: 1
      }));

      alert(`${quantity} item(s) added to cart successfully!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Custom styles that extend common styles
  const customStyles = {
    contentContainer: {
      padding: "15px",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    },
    searchInput: {
      ...styles.input,
      maxWidth: "300px",
      margin: "0 auto 20px auto",
    },
    categoryButtons: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    categoryButton: {
      padding: "8px 15px",
      backgroundColor: "#f1f1f1",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    activeCategory: {
      backgroundColor: "#ff6f61",
      color: "white",
    },
    menuGrid: {
      ...styles.grid,
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
    },
    menuItem: {
      ...styles.card,
      padding: "15px",
    },
    menuImage: {
      width: "100%", 
      height: "150px",
      objectFit: "cover",
      borderRadius: "5px",
      marginBottom: "10px",
    },
    quantityControl: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      margin: "10px 0",
    },
    quantityButton: {
      ...styles.secondaryButton,
      padding: "5px 10px",
      margin: "0",
    },
    addButton: {
      ...styles.successButton,
      margin: "10px 0 0 0",
    }
  };

  return (
    <Layout>
      <div style={customStyles.contentContainer}>
        <h1 style={styles.heading}>Canteen Menu</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={customStyles.searchInput}
        />
        <div style={customStyles.categoryButtons}>
          {categories.map((category) => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)}
              style={{
                ...customStyles.categoryButton,
                ...(selectedCategory === category ? customStyles.activeCategory : {})
              }}
            >
              {category}
            </button>
          ))}
        </div>
        <div style={customStyles.menuGrid}>
          {filteredItems.map((item) => (
            <div key={item._id} style={customStyles.menuItem}>
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.name}
                style={customStyles.menuImage}
              />
              <h3 style={styles.subheading}>{item.name}</h3>
              <p style={styles.description}>₹ {item.price}</p>
              <div style={customStyles.quantityControl}>
                <button
                  onClick={() => handleQuantityChange(item._id, -1)}
                  style={customStyles.quantityButton}
                >
                  -
                </button>
                <span>{quantities[item._id] || 1}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, 1)}
                  style={customStyles.quantityButton}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => addToCart(item._id)}
                style={customStyles.addButton}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UserMenu;
