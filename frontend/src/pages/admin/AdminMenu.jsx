import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./AdminLayout";

const categories = ["All", "Vegetarian", "Non-Vegetarian", "Desserts"];

const AdminMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/menus/getmenu")
      .then((response) => {
        setMenuItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
        setError("Failed to load menu items.");
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/150?text=No+Image";
    
    // Check if it's already a full URL
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    
    // Handle relative paths
    if (imageUrl.startsWith("/")) {
      return `http://localhost:5000${imageUrl}`;
    } else {
      return `http://localhost:5000/${imageUrl}`;
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div style={styles.mainContent}>
        <h1 style={styles.heading}>Canteen Menu</h1>
        <input
          type="text"
          placeholder="Search for meals..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={styles.searchBar}
        />
        <div style={styles.filterContainer}>
          <span style={styles.filterLabel}>Filter by Category:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                ...styles.filterButton,
                backgroundColor: selectedCategory === category ? "#d1d5db" : "#f3f4f6",
              }}
            >
              {category}
            </button>
          ))}
        </div>
        {loading && <p style={styles.loadingText}>Loading menu items...</p>}
        {error && <p style={styles.errorText}>{error}</p>}
        {!loading && !error && (
          <div style={styles.grid}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <MenuItemCard key={item._id} item={item} getImageUrl={getImageUrl} />
              ))
            ) : (
              <p style={styles.noItemsText}>No menu items found.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

const MenuItemCard = ({ item, getImageUrl }) => {
  return (
    <div style={styles.card}>
      <img 
        src={getImageUrl(item.imageUrl)} 
        alt={item.name} 
        style={styles.image}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/150?text=No+Image";
        }}
      />
      <h3>{item.name}</h3>
      <p>₹ {item.price}</p>
      <p>Category: {item.category}</p>
      <p>Stock: {item.stock}</p>
      <button style={styles.cartButton}>Add to Cart</button>
    </div>
  );
};

const styles = {
  mainContent: {
    width: "100%",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  searchBar: {
    width: "60%",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  filterLabel: {
    fontWeight: "bold",
  },
  filterButton: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  cartButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease-in-out",
  },
  loadingText: {
    fontSize: "1.2rem",
    color: "#1d1d1f",
    padding: "1rem",
  },
  errorText: {
    fontSize: "1.2rem",
    color: "#e74c3c",
    padding: "1rem",
  },
  noItemsText: {
    fontSize: "1.2rem",
    color: "#6e6e73",
    padding: "2rem 0",
  },
};

export default AdminMenu;