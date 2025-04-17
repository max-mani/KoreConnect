import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./UserLayout";
import styles from "../../utils/commonStyles";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [userError, setUserError] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  useEffect(() => {
    if (isFirstLoad) {
      loadProfileData();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const loadProfileData = () => {
    if (!userId) {
      setUserError("User not found. Please log in.");
      return;
    }

    // Set loading states only on first load
    if (isFirstLoad) {
      setLoadingUser(true);
      setLoadingOrders(true);
    }

    // Fetch user details
    fetchUserData();
    
    // Fetch orders separately
    fetchOrders();
  };

  // Fetch user details
  const fetchUserData = async () => {
    try {
      const userResponse = await axios.get(`https://koreconnect.onrender.com/profile/users/${userId}`);
      setUser(userResponse.data);
    } catch (err) {
      setUserError("Failed to load user details. Please try again.");
    } finally {
      setLoadingUser(false);
    }
  };

  // Fetch orders separately
  const fetchOrders = async () => {
    try {
      const ordersResponse = await axios.get(`https://koreconnect.onrender.com/profile/orders/user/${userId}`);
      setOrders(ordersResponse.data);
    } catch (err) {
      setOrderError("Failed to load orders. Please try again.");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Custom styles that extend common styles
  const customStyles = {
    contentContainer: {
      padding: "15px",
      maxWidth: "1000px",
      margin: "0 auto",
      width: "100%",
      boxSizing: "border-box",
    },
    profileCard: {
      ...styles.card,
      textAlign: "left",
      marginBottom: "20px",
    },
    cartContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    cartItem: {
      ...styles.card,
      display: "flex",
      alignItems: "center",
      gap: "15px",
      padding: "15px",
    },
    cartImage: {
      width: "80px",
      height: "80px",
      borderRadius: "5px",
      objectFit: "cover",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "15px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    tableHead: {
      backgroundColor: "#f1f1f1",
    },
    tableRow: {
      borderBottom: "1px solid #ddd",
    },
    tableCell: {
      padding: "12px 15px",
      textAlign: "left",
    },
  };

  // Helper function to color order statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <Layout>
      <div style={customStyles.contentContainer}>
        <h1 style={styles.heading}>Profile</h1>
        <p style={styles.description}>Manage your account details and view order history.</p>

        {/* Show user data even if orders fail */}
        {loadingUser ? (
          <p>Loading profile...</p>
        ) : userError ? (
          <p style={styles.error}>{userError}</p>
        ) : (
          <div style={customStyles.profileCard}>
            <h2 style={styles.subheading}>{user?.name}</h2>
            <p style={styles.description}><strong>Email:</strong> {user?.email}</p>
            <p style={styles.description}><strong>Phone:</strong> {user?.phone}</p>
            <p style={styles.description}><strong>City:</strong> {user?.city}</p>
            <p style={styles.description}><strong>State:</strong> {user?.state}</p>
            <p style={styles.description}><strong>Role:</strong> {user?.role}</p>
            <p style={styles.description}><strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
        )}

        {/* Cart Items */}
        {user?.cart?.length > 0 && (
          <>
            <h2 style={styles.subheading}>Cart Items</h2>
            <div style={customStyles.cartContainer}>
              {user.cart.map((item) => (
                <div key={item._id} style={customStyles.cartItem}>
                  <img src={item.imageUrl} alt={item.name} style={customStyles.cartImage} />
                  <div>
                    <h3 style={styles.subheading}>{item.name}</h3>
                    <p style={styles.description}><strong>Category:</strong> {item.category}</p>
                    <p style={styles.description}><strong>Price:</strong> ₹{item.price}</p>
                    <p style={styles.description}><strong>Stock:</strong> {item.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Order History */}
        <h2 style={styles.subheading}>Order History</h2>
        {loadingOrders ? (
          <p>Loading orders...</p>
        ) : orderError ? (
          <p style={styles.error}>{orderError}</p>
        ) : orders.length === 0 ? (
          <p style={styles.description}>No past orders found.</p>
        ) : (
          <table style={customStyles.table}>
            <thead style={customStyles.tableHead}>
              <tr>
                <th style={customStyles.tableCell}>Order Number</th>
                <th style={customStyles.tableCell}>Total Amount</th>
                <th style={customStyles.tableCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={customStyles.tableRow}>
                  <td style={customStyles.tableCell}>{order.orderNumber}</td>
                  <td style={customStyles.tableCell}>₹{order.totalAmount.toFixed(2)}</td>
                  <td style={{ 
                    ...customStyles.tableCell, 
                    color: getStatusColor(order.status), 
                    fontWeight: "bold" 
                  }}>
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default UserProfile;
