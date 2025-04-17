import { useState, useEffect } from "react";
import Layout from "./AdminLayout";
import './Dashboard.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://koreconnect.onrender.com/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

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
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <h1 style={styles.title}>Order Management Dashboard</h1>

          {/* Loading Indicator */}
          {loading && <p style={styles.loadingText}>Loading orders...</p>}

          {/* Error Handling */}
          {error && <p style={styles.errorText}>{error}</p>}

          {/* Orders List */}
          {!loading && !error && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              width: "100%", 
              alignItems: "center"
            }}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))
              ) : (
                <p style={styles.noOrdersText}>No orders found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Extract OrderCard into a separate functional component
const OrderCard = ({ order }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.orderCard,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 4px 12px rgba(0, 0, 0, 0.1)"
          : "0 2px 6px rgba(0, 0, 0, 0.05)",
        width: "100%",
        maxWidth: "700px"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 style={styles.orderText}>Order #{order.orderNumber}</h2>
      <p style={styles.statusText}>Status: {order.status}</p>
      <a href={`/core/admin/order/${order._id}`} style={styles.link}>
        View Details
      </a>
    </div>
  );
};

// Styles (Updated for better centering and alignment)
const styles = {
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    color: "#1d1d1f",
    textAlign: "center",
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    alignItems: "center"
  },
  orderCard: {
    border: "1px solid #e8ecef",
    padding: "1.5rem",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    transition: "all 0.3s ease-in-out",
    width: "100%"
  },
  orderText: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1d1d1f",
    marginBottom: "0.5rem",
  },
  statusText: {
    fontSize: "1rem",
    color: "#6e6e73",
    marginBottom: "0.5rem",
  },
  link: {
    fontSize: "0.875rem",
    color: "#007aff",
    textDecoration: "none",
    cursor: "pointer",
    marginTop: "0.5rem",
    display: "inline-block",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  noOrdersText: {
    textAlign: "center",
    color: "#6e6e73",
    fontSize: "1rem",
    padding: "2rem 0",
    width: "100%",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#1d1d1f",
    padding: "1rem",
  },
  errorText: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#e74c3c",
    padding: "1rem",
  },
};

export default AdminOrders;
