import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "./UserLayout";
import styles from "../../utils/commonStyles";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Fetch cart items
  const fetchCart = async () => {
    try {
      if (!userId) return;
      
      console.log("Fetching cart for user:", userId);
      const response = await axios.get(`https://koreconnect.onrender.com/cart/viewCart/${userId}`);
      console.log("Cart response:", response.data);
      
      // Ensure each item has a quantity property (default to 1 if missing)
      const updatedCart = response.data.cart.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));

      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Failed to load cart. Please refresh the page.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const calculateTotal = (cart) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const updateQuantity = async (productId, amount) => {
    // Log what we're trying to update
    console.log(`Updating item: ${productId} by ${amount}`);
    
    try {
      setUpdating(true);
      
      // Find the current item - ensuring we compare as strings
      const currentItem = cartItems.find(item => 
        item._id && item._id.toString() === productId.toString()
      );
      
      if (!currentItem) {
        console.error(`Item ${productId} not found in cart`);
        setUpdating(false);
        return;
      }
      
      // Calculate new quantity
      const newQuantity = currentItem.quantity + amount;
      console.log(`New quantity calculated: ${newQuantity}`);
      
      // If quantity becomes 0, remove the item
      if (newQuantity <= 0) {
        try {
          console.log("Removing item from cart:", productId);
          // Remove item from cart on server
          const removeResponse = await axios.post("https://koreconnect.onrender.com/cart/remove", {
            userId,
            itemId: productId.toString()
          });
          
          console.log("Remove response:", removeResponse.data);
          
          // Update UI by removing the item
          const filteredItems = cartItems.filter(item => 
            item._id.toString() !== productId.toString()
          );
          
          setCartItems(filteredItems);
          calculateTotal(filteredItems);
          setUpdating(false);
          return;
        } catch (error) {
          console.error("Error removing item from cart:", error);
          console.error("Error response data:", error.response?.data);
          console.error("Error message:", error.message);
          alert("Failed to remove item. Please try again.");
          fetchCart();
          setUpdating(false);
          return;
        }
      }
      
      console.log(`Updating quantity from ${currentItem.quantity} to ${newQuantity}`);
      
      // First update UI for immediate feedback
      const updatedItems = cartItems.map(item => 
        (item._id && item._id.toString() === productId.toString())
          ? { ...item, quantity: newQuantity }
          : item
      );
      
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
      
      try {
        // Send update to server
        const updateData = {
          userId,
          itemId: productId.toString(), // Ensure itemId is a string
          quantity: newQuantity
        };
        console.log("Sending update request with data:", updateData);
        
        const response = await axios.post("https://koreconnect.onrender.com/cart/update", updateData);
        
        console.log("Update response:", response.data);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error message:", error.message);
        
        alert("Failed to update quantity. Please try again.");
        // Refresh to reset to server state
        fetchCart();
      }
    } catch (error) {
      console.error("Error in updateQuantity:", error);
      alert("An error occurred. Please try again.");
      fetchCart();
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post(`https://koreconnect.onrender.com/cart/checkout/${userId}`);
      const orderData = response.data.order;

      localStorage.setItem("orderDetails", JSON.stringify(orderData));

      alert("Checkout successful!");
      navigate("/core/user/order-success");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const cartItemStyles = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    width: "100%",
    maxWidth: "700px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  };

  const quantityControlStyles = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };
  
  const containerStyle = {
    padding: "15px",
    maxWidth: "1000px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  };

  // Debug view for cart items
  console.log("Current cart items:", cartItems);

  return (
    <Layout>
      <div style={containerStyle}>
        <h2 style={styles.heading}>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p style={styles.description}>Your cart is empty.</p>
        ) : (
          <div>
            <div style={{...styles.flexColumn, alignItems: "center"}}>
              {cartItems.map((item) => (
                <div key={item._id} style={cartItemStyles}>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    style={{width: "80px", height: "80px", borderRadius: "5px"}} 
                  />
                  <div style={{flex: 1, textAlign: "left"}}>
                    <h3 style={styles.subheading}>{item.name}</h3>
                    <p style={styles.description}>₹ {item.price} x {item.quantity} = ₹ {item.price * item.quantity}</p>
                    <div style={quantityControlStyles}>
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        style={styles.secondaryButton}
                        disabled={updating}
                      >
                        -
                      </button>
                      <span style={{fontSize: "16px", margin: "0 10px"}}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        style={styles.secondaryButton}
                        disabled={updating}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <h3 style={{...styles.heading, marginTop: "20px"}}>Total: ₹ {totalPrice}</h3>
            <button 
              onClick={handleCheckout} 
              style={{...styles.successButton, maxWidth: "300px", margin: "20px auto", display: "block"}}
              disabled={updating || cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserCart;
