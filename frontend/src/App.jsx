import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./pages/other/CartContext";
import { useAuth } from "./pages/auth/AuthContext";
import LandingPage from "./pages/other/LandingPage";
import Login from "./pages/user/UserLogin";
import Signup from "./pages/user/UserSignup";
import Browse from "./pages/other/Browse";
import Menu from "./pages/user/UserMenu";
import Order from "./pages/other/Order";
import Contact from "./pages/other/Contact";
import ProtectedRoute from "./pages/auth/AuthProtectedRoute";
import HomeUser from "./pages/user/UserDashboard";
import Cart from "./pages/user/UserCart";
import Profile from "./pages/user/UserProfile";
import OrderTracking from "./pages/user/UserOrderTracking";
import HomeAdmin from "./pages/admin/AdminDashboard";
import MenuVendor from "./pages/admin/AdminMenu";
import Dashboard from "./pages/admin/AdminOrders";
import OrderDetails from "./pages/admin/AdminOrderDetails";
import UpdateOrderStatus from "./pages/admin/AdminOrderStatus";
import OrderSuccess from "./pages/user/UserOrderSuccess";
import Analytics from "./pages/admin/AdminAnalytics";


function App() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to home page
  };
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />
      <Route path="/core/login" element={<Login />} />
      <Route path="/core/signup" element={<Signup />} />
      <Route path="/core/admin/order/:id" element={<OrderDetails />} />
      <Route path="/core/admin/order/:id/update" element={<UpdateOrderStatus />} />
      <Route path="/core/admin/dashboard" element={<Dashboard />} />
      <Route path="/core/admin/vendormenu" element={<MenuVendor />} />
      <Route path="/core/admin/home" element={<HomeAdmin />} />
      <Route path="/core/admin/analytics" element={<Analytics />} />
      
      {/* Protected Routes (Require Login) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/core/home" element={<LandingPage />} />
        <Route path="/core/menu" element={<Menu />} />
        <Route path="/core/order" element={<Order />} /> 
        <Route path="/core/user/home" element={<HomeUser />} />
        <Route path="/core/contact" element={<Contact />} />
        <Route path="/core/browse" element={<Browse />} />
        <Route path="/core/user/cart" element={<Cart />} />
        <Route path="/core/user/profile" element={<Profile />} />
        <Route path="/core/user/order-tracking" element={<OrderTracking />} />
        <Route path="/core/user/menu" element={<Menu />} />
        <Route path="/core/user/order-success" element={<OrderSuccess />} /> 
      </Route>
    </Routes>
  );
}

export default App;
