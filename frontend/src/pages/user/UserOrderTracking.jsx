import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./UserLayout";
import styles from "../../utils/commonStyles";

const UserOrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Retrieve user ID from localStorage
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/orders/userOrder/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Custom styles that extend common styles
  const customStyles = {
    contentContainer: {
      padding: "15px",
      maxWidth: "1000px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    },
    orderList: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "15px",
      marginTop: "20px",
    },
    orderCard: {
      ...styles.card,
      width: "100%",
      maxWidth: "700px",
      textAlign: "left",
    },
    status: {
      fontWeight: "bold",
      color: "#fff",
      padding: "5px 10px",
      borderRadius: "5px",
      display: "inline-block",
      marginTop: "10px",
    },
    itemsList: {
      listStyleType: "none",
      padding: "0",
      margin: "10px 0 0 0",
    },
    itemEntry: {
      padding: "5px 0",
      borderBottom: "1px solid #eee",
    }
  };

  // Function to determine background color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFA500"; // Orange
      case "Processing":
        return "#17a2b8"; // Blue
      case "Completed":
        return "#28a745"; // Green
      case "Cancelled":
        return "#dc3545"; // Red
      default:
        return "#6c757d"; // Grey
    }
  };

  return (
    <Layout>
      <div style={customStyles.contentContainer}>
        <h1 style={styles.heading}>Track Your Order</h1>
        <p style={styles.description}>Check the status of your order in real-time.</p>

        {loading && <p style={styles.description}>Loading orders...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {orders.length === 0 && !loading && <p style={styles.description}>No orders found.</p>}

        <div style={customStyles.orderList}>
          {orders.map((order) => (
            <div key={order._id} style={customStyles.orderCard}>
              <h3 style={styles.subheading}>Order # {order.orderNumber}</h3>
              <p style={styles.description}><strong>Name:</strong> {order.customerName}</p>
              <p style={styles.description}><strong>Email:</strong> {order.email}</p>
              <p style={styles.description}><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              
              <p style={{ ...customStyles.status, backgroundColor: getStatusColor(order.status) }}>
                <strong>Status:</strong> {order.status}
              </p>

              <h4 style={{...styles.subheading, fontSize: "18px", marginTop: "15px"}}>Items:</h4>
              <ul style={customStyles.itemsList}>
                {order.items.map((item, index) => (
                  <li key={index} style={customStyles.itemEntry}>
                    {item.name} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UserOrderTracking;
