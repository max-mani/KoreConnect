import { useEffect, useState } from "react";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Layout from "./AdminLayout";


const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalMenus: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    ordersByStatus: [],
    bestSellingItems: [],
    totalAmountByPaymentStatus: [],
    menuByCategory: [],
    revenueOverTime: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://koreconnect.onrender.com/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug the API response

        // Ensure all properties are defined, even if the API response is incomplete
        setAnalytics({
          totalMenus: data.totalMenus || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
          ordersByStatus: data.ordersByStatus || [],
          bestSellingItems: data.bestSellingItems || [],
          totalAmountByPaymentStatus: data.totalAmountByPaymentStatus || [],
          menuByCategory: data.menuByCategory || [],
          revenueOverTime: data.revenueOverTime || [],
        });
      } catch (error) {
        setError(error.message);
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Bar chart for overview (Menus, Orders, Users, Revenue)
  const overviewChartData = {
    labels: ["Menus", "Orders", "Users", "Revenue"],
    datasets: [
      {
        label: "Count",
        data: [
          analytics.totalMenus,
          analytics.totalOrders,
          analytics.totalUsers,
          analytics.totalRevenue,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)", // Blue
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(255, 206, 86, 0.6)", // Yellow
          "rgba(255, 99, 132, 0.6)", // Red
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for Orders by Status
  const ordersByStatusData = {
    labels: (analytics.ordersByStatus || []).map((item) => item._id) || [],
    datasets: [
      {
        label: "Orders by Status",
        data: (analytics.ordersByStatus || []).map((item) => item.count) || [],
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)", // Purple (Delivered)
          "rgba(255, 159, 64, 0.6)", // Orange (New)
          "rgba(255, 99, 132, 0.6)", // Red (On Delivery)
          "rgba(75, 192, 192, 0.6)", // Green (Cancelled)
        ],
        borderColor: [
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart for Best Selling Items (changed from Pie to Bar)
  const bestSellingItemsData = {
    labels: (analytics.bestSellingItems || []).map((item) => item._id) || [],
    datasets: [
      {
        label: "Number of Orders",
        data: (analytics.bestSellingItems || []).map((item) => item.count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red
          "rgba(153, 102, 255, 0.6)", // Purple
          "rgba(75, 192, 192, 0.6)", // Green
          "rgba(255, 159, 64, 0.6)", // Orange
          "rgba(255, 206, 86, 0.6)", // Yellow
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart for Total Amount by Payment Status
  const totalAmountByPaymentStatusData = {
    labels: (analytics.totalAmountByPaymentStatus || []).map((item) => item._id) || [],
    datasets: [
      {
        label: "Total Amount (₹)",
        data: (analytics.totalAmountByPaymentStatus || []).map((item) => item.totalAmount) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart for Menu by Category
  const menuByCategoryData = {
    labels: (analytics.menuByCategory || []).map((item) => item._id) || [],
    datasets: [
      {
        label: "Menu by Category",
        data: (analytics.menuByCategory || []).map((item) => item.count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)", // Red (Non-Vegetarian)
          "rgba(75, 192, 192, 0.6)", // Green (Vegetarian)
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Line chart for Revenue Over Time
  const revenueOverTimeData = {
    labels: (analytics.revenueOverTime || []).map((item) => item.date) || [],
    datasets: [
      {
        label: "Revenue Over Time",
        data: (analytics.revenueOverTime || []).map((item) => item.revenue) || [],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
    ],
  };

  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh",
      boxSizing: "border-box",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
      color: "#333",
    },
    summaryContainer: {
      marginBottom: "30px",
      textAlign: "center",
    },
    summaryCard: {
      display: "inline-block",
      width: "220px",
      height: "100px",
      margin: "10px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "15px",
      boxSizing: "border-box",
      verticalAlign: "top",
    },
    summaryCardIcon: {
      display: "inline",
      marginRight: "10px",
    },
    summaryCardContent: {
      display: "inline-block",
      textAlign: "left",
    },
    summaryCardTitle: {
      fontSize: "14px",
      fontWeight: "600",
      margin: "0",
      color: "#333",
    },
    summaryCardValue: {
      fontSize: "24px",
      margin: "5px 0 0 0",
      color: "#333",
    },
    chartsContainer: {
      display: "block",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    chartWrapper: {
      display: "inline-block",
      width: "33.33%",
      height: "400px",
      padding: "15px",
      boxSizing: "border-box",
      verticalAlign: "top",
    },
    chartCard: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      height: "100%",
      boxSizing: "border-box",
    },
    chartTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#333",
    },
    chartContent: {
      width: "100%",
      height: "300px",
    },
    loadingText: {
      fontSize: "18px",
      color: "#6e6e73",
      textAlign: "center",
      marginTop: "20px",
    },
    errorText: {
      fontSize: "18px",
      color: "#e74c3c",
      textAlign: "center",
      marginTop: "20px",
    },
  };

  return (
    <Layout>
      <div style={styles.container}>
        <h1 style={styles.heading}>Analytics Dashboard</h1>

        {/* Summary Cards */}
        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : (
          <div style={styles.summaryContainer}>
            <div
              style={{
                ...styles.summaryCard,
                backgroundColor: "#fff3cd",
              }}
            >
              <div style={styles.summaryCardIcon}>
                <svg
                  style={{ width: "32px", height: "32px", fill: "#ffca28" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14h-1v6l5.2 3.2.8-1.3-4-2.6V6z" />
                </svg>
              </div>
              <div style={styles.summaryCardContent}>
                <h3 style={styles.summaryCardTitle}>Total Menus</h3>
                <p style={styles.summaryCardValue}>{analytics.totalMenus}</p>
              </div>
            </div>

            <div
              style={{
                ...styles.summaryCard,
                backgroundColor: "#f8d7da",
              }}
            >
              <div style={styles.summaryCardIcon}>
                <svg
                  style={{ width: "32px", height: "32px", fill: "#f06292" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14h-1v6l5.2 3.2.8-1.3-4-2.6V6z" />
                </svg>
              </div>
              <div style={styles.summaryCardContent}>
                <h3 style={styles.summaryCardTitle}>Total Orders</h3>
                <p style={styles.summaryCardValue}>{analytics.totalOrders}</p>
              </div>
            </div>

            <div
              style={{
                ...styles.summaryCard,
                backgroundColor: "#d1ecf1",
              }}
            >
              <div style={styles.summaryCardIcon}>
                <svg
                  style={{ width: "32px", height: "32px", fill: "#4fc3f7" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14h-1v6l5.2 3.2.8-1.3-4-2.6V6z" />
                </svg>
              </div>
              <div style={styles.summaryCardContent}>
                <h3 style={styles.summaryCardTitle}>Total Users</h3>
                <p style={styles.summaryCardValue}>{analytics.totalUsers}</p>
              </div>
            </div>

            <div
              style={{
                ...styles.summaryCard,
                backgroundColor: "#e2d6f5",
              }}
            >
              <div style={styles.summaryCardIcon}>
                <svg
                  style={{ width: "32px", height: "32px", fill: "#ab47bc" }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14h-1v6l5.2 3.2.8-1.3-4-2.6V6z" />
                </svg>
              </div>
              <div style={styles.summaryCardContent}>
                <h3 style={styles.summaryCardTitle}>Total Revenue</h3>
                <p style={styles.summaryCardValue}>₹{analytics.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {loading ? (
          <p style={styles.loadingText}>Loading charts...</p>
        ) : error ? (
          <p style={styles.errorText}>{error}</p>
        ) : (
          <div style={styles.chartsContainer}>
            {/* Overview Bar Chart */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Overview</h3>
                <div style={styles.chartContent}>
                  <Bar
                    data={overviewChartData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>

            {/* Orders by Status Pie Chart */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Orders by Status</h3>
                <div style={styles.chartContent}>
                  <Pie
                    data={ordersByStatusData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>

            {/* Best Selling Items Bar Chart (changed from Pie to Bar) */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Best Selling Items</h3>
                <div style={styles.chartContent}>
                  <Bar
                    data={bestSellingItemsData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>

            {/* Total Amount by Payment Status Bar Chart */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Total Amount by Payment Status</h3>
                <div style={styles.chartContent}>
                  <Bar
                    data={totalAmountByPaymentStatusData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>

            {/* Menu by Category Doughnut Chart */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Menu by Category</h3>
                <div style={styles.chartContent}>
                  <Doughnut
                    data={menuByCategoryData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>

            {/* Revenue Over Time Line Chart */}
            <div style={styles.chartWrapper}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Revenue Over Time</h3>
                <div style={styles.chartContent}>
                  <Line
                    data={revenueOverTimeData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminAnalytics;