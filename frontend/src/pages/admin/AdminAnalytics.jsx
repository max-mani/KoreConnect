import { useState, useEffect } from "react";
import Layout from "./AdminLayout";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

// Completely disable animations globally
ChartJS.defaults.animation = false;
ChartJS.defaults.animations = false;
ChartJS.defaults.transitions = false;

// Make charts fill their container
ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;

const AdminAnalytics = () => {
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
  const [ordersData, setOrdersData] = useState({ labels: [], datasets: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    popularCategory: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("summary");

  // Fetch data only once on initial component mount
  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('analytics_loaded');
    
    // If not already loaded or user manually refreshed
    if (!alreadyLoaded || performance.navigation.type === 1) {
      fetchAnalyticsData();
      // Mark as loaded for this session
      sessionStorage.setItem('analytics_loaded', 'true');
    } else {
      // Data was already loaded, skip loading state
        setLoading(false);
      }
    
    // Clean up on component unmount
    return () => {
      // Keep the session storage item to persist between tab changes
    };
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Simulate API call for revenue data
      const revenueResponse = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [1200, 1900, 3000, 5000, 2000, 3000],
      };

      // Simulate API call for orders data
      const ordersResponse = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        data: [10, 25, 30, 50, 45, 60],
      };

      // Simulate API call for category data
      const categoryResponse = {
        labels: ["Vegetarian", "Non-Vegetarian", "Desserts", "Beverages"],
        data: [30, 40, 15, 15],
      };

      // Simulate API call for summary data
      const summaryResponse = {
        totalRevenue: 16100,
        totalOrders: 220,
        averageOrderValue: 73.18,
        popularCategory: "Non-Vegetarian",
      };

      setRevenueData({
        labels: revenueResponse.labels,
    datasets: [
      {
            label: "Revenue (₹)",
            data: revenueResponse.data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
        ],
      });

      setOrdersData({
        labels: ordersResponse.labels,
    datasets: [
      {
            label: "Orders",
            data: ordersResponse.data,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
      },
    ],
      });

      setCategoryData({
        labels: categoryResponse.labels,
    datasets: [
      {
            label: "Categories",
            data: categoryResponse.data,
        backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
      });

      setSummary(summaryResponse);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Common chart options to ensure static display
  const staticChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    animations: {
      colors: false,
      x: false,
      y: false
    },
    transitions: {
      active: {
        animation: {
          duration: 0
        }
      }
    },
    elements: {
      point: {
        radius: 3,
      },
      line: {
        tension: 0 // straight lines
      }
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true, animation: false }
    },
    layout: {
      padding: 10
    }
  };

  // Tab button style
  const tabButtonStyle = (isActive) => ({
    padding: "10px 20px",
    backgroundColor: isActive ? "#3498db" : "#f0f0f0",
    color: isActive ? "white" : "#333",
    border: "none",
    borderRadius: "5px 5px 0 0",
    cursor: "pointer",
    fontWeight: isActive ? "bold" : "normal",
    margin: "0 5px",
  });

  // Chart container style
  const chartContainerStyle = {
      width: "100%",
      height: "400px",
    position: "relative",
    marginBottom: "20px"
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <p>Loading analytics data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 10px",
        boxSizing: "border-box"
      }}>
        {/* Tab Navigation */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          borderBottom: "1px solid #ddd",
          marginBottom: "15px", 
          backgroundColor: "#f5f7fa",
          width: "100%"
        }}>
          <button 
            style={tabButtonStyle(activeTab === "summary")} 
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
          <button 
            style={tabButtonStyle(activeTab === "revenue")} 
            onClick={() => setActiveTab("revenue")}
          >
            Revenue
          </button>
          <button 
            style={tabButtonStyle(activeTab === "orders")} 
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button 
            style={tabButtonStyle(activeTab === "categories")} 
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
              </div>

        {/* Tab Content */}
        <div style={{ 
          flex: 1, 
          padding: "10px", 
          backgroundColor: "#f5f7fa",
          overflow: "visible", 
          width: "100%"
        }}>
          {/* Summary Dashboard */}
          {activeTab === "summary" && (
            <div style={{ padding: "15px", backgroundColor: "#fff", borderRadius: "10px", width: "100%" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>Analytics Dashboard</h2>
              
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "15px", 
                justifyContent: "center", 
                marginBottom: "20px" 
              }}>
                {/* Summary Cards */}
                <div style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  width: "200px",
                  textAlign: "center",
                }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Total Revenue</h3>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>₹{summary.totalRevenue.toLocaleString()}</p>
            </div>

                <div style={{
                  backgroundColor: "#2ecc71",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  width: "200px",
                  textAlign: "center",
                }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Total Orders</h3>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>{summary.totalOrders}</p>
            </div>

                <div style={{
                  backgroundColor: "#f39c12",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  width: "200px",
                  textAlign: "center",
                }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Average Order</h3>
                  <p style={{ fontSize: "24px", fontWeight: "bold" }}>₹{summary.averageOrderValue.toFixed(2)}</p>
          </div>
                
                <div style={{
                  backgroundColor: "#9b59b6",
                  color: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  width: "200px",
                  textAlign: "center",
                }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Popular Category</h3>
                  <p style={{ fontSize: "20px", fontWeight: "bold" }}>{summary.popularCategory}</p>
              </div>
            </div>

              {/* Mini Charts */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                <div style={{ width: "45%", minWidth: "300px", maxWidth: "500px" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px", textAlign: "center" }}>Recent Revenue Trend</h3>
                  <div style={chartContainerStyle}>
                    <Line 
                      data={revenueData} 
                      options={{
                        ...staticChartOptions,
                        plugins: {
                          ...staticChartOptions.plugins,
                          legend: { position: 'top' }
                        }
                      }} 
                  />
                </div>
              </div>
                <div style={{ width: "45%", minWidth: "300px", maxWidth: "500px" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "10px", textAlign: "center" }}>Category Distribution</h3>
                  <div style={chartContainerStyle}>
                    <Pie 
                      data={categoryData} 
                      options={{
                        ...staticChartOptions,
                        plugins: {
                          ...staticChartOptions.plugins,
                          legend: { position: 'right' }
                        }
                      }} 
                    />
            </div>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Chart */}
          {activeTab === "revenue" && (
            <div style={{ padding: "15px", backgroundColor: "#fff", borderRadius: "10px", width: "100%" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>Revenue Analysis</h2>
              <div style={chartContainerStyle}>
                <Line 
                  data={revenueData} 
                  options={{
                    ...staticChartOptions,
                    plugins: {
                      ...staticChartOptions.plugins,
                      title: { display: true, text: 'Monthly Revenue (₹)' }
                    },
                    scales: {
                      y: { 
                        beginAtZero: true, 
                        title: { display: true, text: 'Revenue (₹)' },
                        ticks: { stepSize: 1000 }
                      }
                    }
                  }} 
                  />
                </div>
              <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Revenue Insights</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>Highest revenue month: April (₹5,000)</li>
                  <li>Total revenue in the period: ₹{revenueData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}</li>
                  <li>Average monthly revenue: ₹{(revenueData.datasets[0].data.reduce((a, b) => a + b, 0) / revenueData.labels.length).toFixed(2)}</li>
                </ul>
              </div>
            </div>
          )}

          {/* Orders Chart */}
          {activeTab === "orders" && (
            <div style={{ padding: "15px", backgroundColor: "#fff", borderRadius: "10px", width: "100%" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>Orders Analysis</h2>
              <div style={chartContainerStyle}>
                <Bar 
                  data={ordersData} 
                  options={{
                    ...staticChartOptions,
                    plugins: {
                      ...staticChartOptions.plugins,
                      title: { display: true, text: 'Monthly Orders' }
                    },
                    scales: {
                      y: { 
                        beginAtZero: true, 
                        title: { display: true, text: 'Number of Orders' },
                        ticks: { stepSize: 10 }
                      }
                    }
                  }} 
                  />
                </div>
              <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Order Insights</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>Highest order month: June (60 orders)</li>
                  <li>Total orders in the period: {ordersData.datasets[0].data.reduce((a, b) => a + b, 0)}</li>
                  <li>Average monthly orders: {(ordersData.datasets[0].data.reduce((a, b) => a + b, 0) / ordersData.labels.length).toFixed(1)}</li>
                  <li>Growth rate (Jan to Jun): {((ordersData.datasets[0].data[5] - ordersData.datasets[0].data[0]) / ordersData.datasets[0].data[0] * 100).toFixed(1)}%</li>
                </ul>
              </div>
            </div>
          )}

          {/* Categories Chart */}
          {activeTab === "categories" && (
            <div style={{ padding: "15px", backgroundColor: "#fff", borderRadius: "10px", width: "100%" }}>
              <h2 style={{ fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>Category Analysis</h2>
              <div style={{...chartContainerStyle, maxWidth: "100%"}}>
                <Pie 
                  data={categoryData} 
                  options={{
                    ...staticChartOptions,
                    plugins: {
                      ...staticChartOptions.plugins,
                      title: { display: true, text: 'Orders by Category' }
                    }
                  }} 
                  />
                </div>
              <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Category Insights</h3>
                <ul style={{ paddingLeft: "20px" }}>
                  <li>Most popular category: {summary.popularCategory} ({categoryData.datasets[0].data[categoryData.labels.indexOf(summary.popularCategory)]}%)</li>
                  <li>Least popular category: {categoryData.labels[categoryData.datasets[0].data.indexOf(Math.min(...categoryData.datasets[0].data))]} ({Math.min(...categoryData.datasets[0].data)}%)</li>
                  <li>Vegetarian vs Non-Vegetarian ratio: {categoryData.datasets[0].data[0]}:{categoryData.datasets[0].data[1]}</li>
                </ul>
              </div>
            </div>
          )}
          </div>
      </div>
    </Layout>
  );
};

export default AdminAnalytics;