import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./AdminLayout";

const AdminDashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalOrders: 0,
    newOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    menuItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isFirstLoad) {
      fetchSummaryData();
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);

  const fetchSummaryData = async () => {
    if (isFirstLoad) {
      setLoading(true);
    }
    
    try {
      // Here you would typically fetch real data from your API
      // For demo purposes, we're using static data
      const mockData = {
        totalOrders: 246,
        newOrders: 18,
        deliveredOrders: 198,
        totalRevenue: 25480,
        menuItems: 32
      };
      
      // Simulate API call
      setTimeout(() => {
        setSummaryData(mockData);
        setLoading(false);
      }, 800);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: "Total Orders",
      value: summaryData.totalOrders,
      color: "#3498db",
      icon: "📊",
      action: () => navigate("/core/admin/orders")
    },
    {
      title: "New Orders",
      value: summaryData.newOrders,
      color: "#e74c3c",
      icon: "🆕",
      action: () => navigate("/core/admin/orders")
    },
    {
      title: "Delivered Orders",
      value: summaryData.deliveredOrders,
      color: "#2ecc71",
      icon: "✅",
      action: () => navigate("/core/admin/orders")
    },
    {
      title: "Total Revenue",
      value: `₹${summaryData.totalRevenue.toLocaleString()}`,
      color: "#f39c12",
      icon: "💰",
      action: () => navigate("/core/admin/analytics")
    },
    {
      title: "Menu Items",
      value: summaryData.menuItems,
      color: "#9b59b6",
      icon: "🍔",
      action: () => navigate("/core/admin/viewmenu")
    }
  ];

  const quickActions = [
    {
      title: "Add Menu Item",
      color: "#27ae60",
      icon: "➕",
      action: () => navigate("/core/admin/addmenu")
    },
    {
      title: "View Menu",
      color: "#3498db",
      icon: "👁️",
      action: () => navigate("/core/admin/viewmenu")
    },
    {
      title: "Manage Orders",
      color: "#e67e22",
      icon: "📋",
      action: () => navigate("/core/admin/orders")
    },
    {
      title: "View Analytics",
      color: "#8e44ad",
      icon: "📈",
      action: () => navigate("/core/admin/analytics")
    }
  ];

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
        <h1 style={{ 
          fontSize: "28px", 
          fontWeight: "bold", 
          marginBottom: "25px", 
          textAlign: "center",
          color: "#2c3e50",
          width: "100%"
        }}>
          Admin Dashboard
        </h1>

        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "300px",
            width: "100%"
          }}>
            <p style={{ fontSize: "18px", color: "#7f8c8d" }}>Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "20px", 
              justifyContent: "center", 
              marginBottom: "30px",
              width: "100%"
            }}>
              {dashboardCards.map((card, index) => (
                <div 
                  key={index}
                  onClick={card.action}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    width: "220px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    ":hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 6px 10px rgba(0,0,0,0.15)",
                    }
                  }}
                >
                  <div style={{ 
                    fontSize: "36px", 
                    marginBottom: "10px",
                    backgroundColor: `${card.color}20`,
                    color: card.color,
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{ fontSize: "16px", color: "#7f8c8d", marginBottom: "5px" }}>{card.title}</h3>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: card.color }}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 style={{ 
              fontSize: "22px", 
              fontWeight: "bold", 
              marginBottom: "20px", 
              textAlign: "center",
              color: "#2c3e50",
              width: "100%"
            }}>
              Quick Actions
            </h2>
            <div style={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "15px", 
              justifyContent: "center",
              width: "100%" 
            }}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  style={{
                    backgroundColor: action.color,
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span>{action.icon}</span>
                  {action.title}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;