import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./AdminLayout";

const AdminDashboard = () => {
  const [image, setImage] = useState(null);
  const [menus, setMenus] = useState([]);
  const [menuData, setMenuData] = useState({ name: "", price: "", category: "", stock: "" });
  const [editingMenu, setEditingMenu] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/menus/getmenu");
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleInputChange = (e) => {
    setMenuData({ ...menuData, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
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
      const response = await axios.post("http://localhost:5000/menus/addmenu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Menu added successfully!");
      fetchMenus();
      setMenuData({ name: "", price: "", category: "", stock: "" });
      setImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/menus/${id}`);
      fetchMenus();
      toast.success("Menu deleted successfully!");
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Failed to delete menu");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setMenuData({ name: menu.name, price: menu.price, category: menu.category, stock: menu.stock });
  };

  const handleUpdate = async () => {
    if (!editingMenu) return;
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/menus/${editingMenu._id}`, menuData);
      fetchMenus();
      setEditingMenu(null);
      setMenuData({ name: "", price: "", category: "", stock: "" });
      toast.success("Menu updated successfully!");
    } catch (error) {
      console.error("Error updating menu:", error);
      toast.error("Failed to update menu");
    } finally {
      setLoading(false);
    }
  };

  const styles = `
    @media (max-width: 768px) {
      .main-content {
        padding: 15px !important;
      }
      .form-section, .menu-list-section {
        padding: 15px !important;
      }
      table {
        font-size: 12px !important;
      }
      img {
        width: 40px !important;
        height: 40px !important;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: 10px !important;
      }
      .form-section, .menu-list-section {
        padding: 10px !important;
      }
      table {
        font-size: 10px !important;
      }
      img {
        width: 30px !important;
        height: 30px !important;
      }
    }
  `;

  return (
    <Layout>
      <style>{styles}</style>
      <div className="main-content" style={{
        flex: 1,
        backgroundColor: "#f5f7fa",
        padding: "20px",
        boxSizing: "border-box",
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: "#2c3e50",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}>
          <h1 style={{
            fontSize: "24px",
            fontWeight: "bold",
            margin: 0,
            color: "#fff",
          }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Add or Update Menu Item</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "500px", margin: "0 auto" }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold" }}>Image:</label>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "10px" }}>
              {editingMenu ? (
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#f39c12",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? "Updating..." : "Update Menu"}
                </button>
              ) : (
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2ecc71",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {loading ? "Adding..." : "Add Menu"}
                </button>
              )}
              {editingMenu && (
                <button
                  onClick={() => {
                    setEditingMenu(null);
                    setMenuData({ name: "", price: "", category: "", stock: "" });
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Menu List */}
        <div style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Menu Items</h2>
          {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
          {menus.length === 0 && !loading && (
            <p style={{ textAlign: "center" }}>No menu items found.</p>
          )}
          {menus.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f39c12", color: "#fff" }}>
                    <th style={{ padding: "10px", textAlign: "left" }}>Image</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Price</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Category</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Stock</th>
                    <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "10px" }}>
                        <img
                          src={
                            menu.imageUrl
                              ? menu.imageUrl.startsWith("http")
                                ? menu.imageUrl
                                : `http://localhost:5000${menu.imageUrl}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={menu.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50?text=No+Image";
                          }}
                        />
                      </td>
                      <td style={{ padding: "10px" }}>{menu.name}</td>
                      <td style={{ padding: "10px" }}>₹{menu.price}</td>
                      <td style={{ padding: "10px" }}>{menu.category}</td>
                      <td style={{ padding: "10px" }}>{menu.stock}</td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => handleEdit(menu)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#3498db",
                            color: "#fff",
                            border: "none",
                            borderRadius: "3px",
                            marginRight: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menu._id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;