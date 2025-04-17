import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./AdminLayout";
import { placeholderUrls, handleImageError } from "../../utils/placeholderUtil";

const categories = ["All", "Vegetarian", "Non-Vegetarian", "Desserts"];

const AdminMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://koreconnect.onrender.com/menus/getmenu")
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
    if (!imageUrl) return placeholderUrls.profile;
    
    // Check if it's already a full URL
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    
    // Handle relative paths
    if (imageUrl.startsWith("/")) {
      return `https://koreconnect.onrender.com${imageUrl}`;
    } else {
      return `https://koreconnect.onrender.com/${imageUrl}`;
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === "All" || item.category === selectedCategory) &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div style={{
        width: "100%", 
        padding: "0 10px",
        backgroundColor: "#f5f7fa",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box"
      }}>
        <div style={{
          padding: "20px",
          backgroundColor: "#fff", 
          borderRadius: "10px", 
          width: "100%",
          maxWidth: "1100px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h1 style={styles.heading}>Canteen Menu</h1>
          
          <div style={styles.searchFilterContainer}>
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
          </div>
          
          {loading && <p style={styles.loadingText}>Loading menu items...</p>}
          {error && <p style={styles.errorText}>{error}</p>}
          
          {!loading && !error && (
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              {filteredItems.length > 0 ? (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.tableHeaderCell}>Image</th>
                      <th style={styles.tableHeaderCell}>Name</th>
                      <th style={styles.tableHeaderCell}>Price</th>
                      <th style={styles.tableHeaderCell}>Category</th>
                      <th style={styles.tableHeaderCell}>Stock</th>
                      <th style={styles.tableHeaderCell}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item._id} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <img 
                            src={getImageUrl(item.imageUrl)} 
                            alt={item.name} 
                            style={styles.tableImage}
                            onError={(e) => handleImageError(e, "50", "No Image")}
                          />
                        </td>
                        <td style={styles.tableCell}>{item.name}</td>
                        <td style={styles.tableCell}>₹{item.price}</td>
                        <td style={styles.tableCell}>{item.category}</td>
                        <td style={styles.tableCell}>{item.stock}</td>
                        <td style={styles.tableCell}>
                          <button style={styles.actionButton}>Add to Cart</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={styles.noItemsText}>No menu items found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const styles = {
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  searchFilterContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
    width: "100%",
  },
  searchBar: {
    width: "100%",
    maxWidth: "500px",
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "10px",
    width: "100%",
  },
  filterLabel: {
    fontWeight: "bold",
    margin: "5px",
  },
  filterButton: {
    padding: "8px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "750px",
  },
  tableHeader: {
    backgroundColor: "#f39c12",
    color: "#fff",
  },
  tableHeaderCell: {
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "12px",
    textAlign: "center",
    verticalAlign: "middle",
  },
  tableImage: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "5px",
  },
  actionButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "7px 12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background 0.2s ease-in-out",
  },
  loadingText: {
    fontSize: "1.2rem",
    color: "#1d1d1f",
    padding: "1rem",
    textAlign: "center",
  },
  errorText: {
    fontSize: "1.2rem",
    color: "#e74c3c",
    padding: "1rem",
    textAlign: "center",
  },
  noItemsText: {
    fontSize: "1.2rem",
    color: "#6e6e73",
    padding: "2rem 0",
    textAlign: "center",
    width: "100%",
  },
};

export default AdminMenu;