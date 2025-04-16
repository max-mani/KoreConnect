import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4f46e5 0%,white 100%)",
    padding: "2rem",
    position: "relative",
    overflow: "hidden",
    "&::before": {  
      content: '""',
      position: "absolute",
      width: "150%",
      height: "150%",
      background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      transform: "rotate(-15deg)",
      pointerEvents: "none",
    },
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px) saturate(180%)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.18)",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    zIndex: 1,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    ":hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.25)",
    },
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "1.5rem",
    letterSpacing: "-0.5px",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  orderNumber: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "rgba(255,255,255,0.95)",
    marginBottom: "0.5rem",
  },
  infoText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "1rem",
    margin: "0.75rem 0",
    lineHeight: "1.5",
  },
  status: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.9)",
    margin: "1.5rem 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  statusBadge: {
    padding: "0.5rem 1.25rem",
    borderRadius: "2rem",
    fontWeight: "600",
    display: "inline-flex",
    alignItems: "center",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    textTransform: "uppercase",
    fontSize: "0.875rem",
    letterSpacing: "0.5px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    marginTop: "2rem",
  },
  button: {
    padding: "0.875rem 1.5rem",
    borderRadius: "0.75rem",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "none",
    outline: "none",
    color: "white",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    },
    "&:active": {
      transform: "translateY(0)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover::before": {
      opacity: 1,
    },
  },
  pending: {
    background: "linear-gradient(45deg, #facc15 0%, #eab308 100%)",
    color: "#1c1917",
  },
  preparing: {
    background: "linear-gradient(45deg, #3b82f6 0%, #2563eb 100%)",
  },
  ready: {
    background: "linear-gradient(45deg, #22c55e 0%, #16a34a 100%)",
  },
  loadingText: {
    textAlign: "center",
    fontSize: "1.25rem",
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
    animation: "pulse 1.5s infinite",
  },
  "@keyframes pulse": {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.5 },
  },
};

const AdminOrderStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setStatus(res.data.status);
      })
      .catch((err) => console.error("Error fetching order:", err));
  }, [id]);

  const updateStatus = (newStatus) => {
    axios
      .put(`http://localhost:5000/orders/${id}`, { status: newStatus })
      .then(() => {
        setStatus(newStatus);
        alert("Order status updated successfully!");
        navigate(`/order/${id}`);
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  if (!order) return <p style={styles.loadingText}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Update Order Status</h1>

        <div>
          <h2 style={styles.orderNumber}>Order #{order.orderNumber}</h2>
          <p style={styles.infoText}><strong>Customer Name:</strong> {order.customerName}</p>

          <p style={styles.status}>
            <strong>Current Status:</strong> 
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor:
                  status === "Pending" ? "#facc15" :
                  status === "Preparing" ? "#3b82f6" :
                  "#22c55e",
                color: status === "Pending" ? "#000" : "#fff",
              }}
            >
              {status}
            </span>
          </p>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => updateStatus("Pending")}
              style={{ ...styles.button, ...styles.pending }}
            >
              Pending
            </button>
            <button
              onClick={() => updateStatus("Preparing")}
              style={{ ...styles.button, ...styles.preparing }}
            >
              Preparing
            </button>
            <button
              onClick={() => updateStatus("Ready")}
              style={{ ...styles.button, ...styles.ready }}
            >
              Ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderStatus;
