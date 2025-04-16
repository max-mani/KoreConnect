import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "24px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  card: {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    padding: "24px",
    transition: "transform 0.3s ease-in-out",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center",
    color: "#333",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginTop: "20px",
    borderBottom: "2px solid #ddd",
    paddingBottom: "5px",
    color: "#444",
  },
  list: {
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "6px",
    fontSize: "16px",
  },
  status: (status) => ({
    fontWeight: "bold",
    color:
      status === "Completed"
        ? "green"
        : status === "Pending"
        ? "orange"
        : "red",
    padding: "5px 10px",
    borderRadius: "6px",
    backgroundColor:
      status === "Completed"
        ? "#d1fae5"
        : status === "Pending"
        ? "#fef3c7"
        : "#fee2e2",
  }),
  totalAmount: {
    fontWeight: "bold",
    fontSize: "18px",
    marginTop: "12px",
    color: "#1f2937",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "16px",
    transition: "background 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#1e40af",
  },
  updateStatusContainer: {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  },
  updateStatusTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  statusButton: {
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    outline: "none",
    color: "white",
    transition: "transform 0.2s, box-shadow 0.3s",
  },
  pendingButton: {
    backgroundColor: "#facc15",
    color: "#000",
  },
  preparingButton: {
    backgroundColor: "#3b82f6",
  },
  readyButton: {
    backgroundColor: "#22c55e",
  },
};

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = () => {
    axios
      .get(`http://localhost:5000/orders/getorder/${id}`)
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => console.error("Error fetching order details:", err));
  };

  const updateStatus = (newStatus) => {
    axios
      .put(`http://localhost:5000/orders/updateStatus/${id}`, { status: newStatus })
      .then(() => {
        setStatus(newStatus); // Update the status in the state
        setOrder((prevOrder) => ({ ...prevOrder, status: newStatus })); // Update the order object
        alert("Order status updated successfully!");
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  if (!order)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}><b>Order Details</b></h1>
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}><b>Order #{order.orderNumber}</b></h2>
        <p>
          <strong>Customer Name:</strong> {order.customerName}
        </p>
        <p>
          <strong>Email:</strong> {order.customerEmail}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>
        <p>
          <strong>Current Status:</strong>{" "}
          <span style={styles.status(status)}>{status}</span>
        </p>

        <h3 style={styles.sectionTitle}>Food Items:</h3>
        <ul style={styles.list}>
          {order?.items?.map((item, index) => (
            <li key={index} style={styles.listItem}>
              {item.name} - ₹{item.price}
            </li>
          ))}
        </ul>

        <p style={styles.totalAmount}>
          <strong>Total Amount:</strong> ₹{order.totalAmount}
        </p>

        <div style={styles.updateStatusContainer}>
          <h3 style={styles.updateStatusTitle}>Update Order Status</h3>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => updateStatus("Pending")}
              style={{ ...styles.statusButton, ...styles.pendingButton }}
            >
              Pending
            </button>
            <button
              onClick={() => updateStatus("Preparing")}
              style={{ ...styles.statusButton, ...styles.preparingButton }}
            >
              Preparing
            </button>
            <button
              onClick={() => updateStatus("Ready")}
              style={{ ...styles.statusButton, ...styles.readyButton }}
            >
              Ready
            </button>
          </div>
        </div>

        <Link
          to="/core/admin/dashboard"  
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1e40af")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default AdminOrderDetails;