import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserOrderSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const order = JSON.parse(localStorage.getItem("orderDetails"));
    if (order) {
      setOrderDetails(order);
    } else {
      navigate("/"); // Redirect if no order found
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎉 Order Placed Successfully!</h2>
      {orderDetails ? (
        <div style={styles.orderDetails}>
          <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
          <p><strong>Name:</strong> {orderDetails.customerName}</p>
          <p><strong>Email:</strong> {orderDetails.email}</p>
          <p><strong>Total Amount:</strong> ₹{orderDetails.totalAmount}</p>
          <h3>Items:</h3>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index}>{item.name} - ₹{item.price}</li>
            ))}
          </ul>
          <button style={styles.homeButton} onClick={() => navigate("/core/user/home")}>
            Go to Home
          </button>
        </div>
      ) : (
        <p>Loading order details...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  orderDetails: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "8px",
    display: "inline-block",
    textAlign: "left",
  },
  homeButton: {
    marginTop: "15px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default UserOrderSuccess;
