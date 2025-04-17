import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./AdminLayout";

const AdminAddMenu = () => {
  const [image, setImage] = useState(null);
  const [menuData, setMenuData] = useState({ name: "", price: "", category: "", stock: "" });
  const [editingMenu, setEditingMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a menu to edit in sessionStorage
    const storedMenu = sessionStorage.getItem('editMenu');
    if (storedMenu) {
      const menu = JSON.parse(storedMenu);
      setEditingMenu(menu);
      setMenuData({ 
        name: menu.name, 
        price: menu.price, 
        category: menu.category, 
        stock: menu.stock 
      });
      // Remove from sessionStorage to avoid unexpected edits on future visits
      sessionStorage.removeItem('editMenu');
    }
  }, []);

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleInputChange = (e) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingMenu) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = async () => {
    if (!image) {
      toast.error("Please select an image first.");
      return;
    }

    if (!menuData.name || !menuData.price || !menuData.category || !menuData.stock) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", menuData.name);
    formData.append("price", menuData.price);
    formData.append("category", menuData.category);
    formData.append("stock", menuData.stock);

    try {
      setLoading(true);
      await axios.post("https://koreconnect.onrender.com/menus/addmenu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Menu item added successfully!");
      setMenuData({ name: "", price: "", category: "", stock: "" });
      setImage(null);
      
      // Navigate to view menu after successful addition
      setTimeout(() => navigate("/core/admin/viewmenu"), 1500);
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!menuData.name || !menuData.price || !menuData.category || !menuData.stock) {
      toast.error("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`https://koreconnect.onrender.com/menus/${editingMenu._id}`, menuData);
      
      toast.success("Menu item updated successfully!");
      
      // Navigate to view menu after successful update
      setTimeout(() => navigate("/core/admin/viewmenu"), 1500);
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast.error("Failed to update menu item.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/core/admin/viewmenu");
  };

  return (
    <Layout>
      <div style={{ 
        width: "100%",
        padding: "0 10px",
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: "#f5f7fa",
        overflow: "visible",
        boxSizing: "border-box"
      }}>
        <div style={{ 
          padding: "25px",
          backgroundColor: "#fff", 
          borderRadius: "10px", 
          width: "100%", 
          maxWidth: "600px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
            {editingMenu ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Name:</label>
              <input
                type="text"
                name="name"
                value={menuData.name}
                onChange={handleInputChange}
                placeholder="Enter item name"
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Price:</label>
              <input
                type="number"
                name="price"
                value={menuData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Category:</label>
              <select
                name="category"
                value={menuData.category}
                onChange={handleInputChange}
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
              >
                <option value="">Select Category</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Stock:</label>
              <input
                type="number"
                name="stock"
                value={menuData.stock}
                onChange={handleInputChange}
                placeholder="Enter available stock"
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
              />
            </div>
            {!editingMenu && (
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "14px", fontWeight: "bold" }}>Image:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
                />
              </div>
            )}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "15px", 
              marginTop: "15px" 
            }}>
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "12px 25px",
                  backgroundColor: editingMenu ? "#f39c12" : "#27ae60",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px"
                }}
              >
                {loading 
                  ? (editingMenu ? "Updating..." : "Adding...") 
                  : (editingMenu ? "Update Menu Item" : "Add Menu Item")
                }
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: "12px 25px",
                  backgroundColor: "#7f8c8d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAddMenu; 