import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./AdminLayout";
import { placeholderUrls, handleImageError } from "../../utils/placeholderUtil";

const AdminViewMenu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://koreconnect.onrender.com/menus/getmenu");
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      toast.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu?")) return;
    try {
      setLoading(true);
      await axios.delete(`https://koreconnect.onrender.com/menus/${id}`);
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
    // Store the menu to edit in sessionStorage
    sessionStorage.setItem('editMenu', JSON.stringify(menu));
    // Navigate to the add menu page where editing will happen
    navigate("/core/admin/addmenu");
  };

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
        <div style={{ 
          padding: "20px",
          backgroundColor: "#fff", 
          borderRadius: "10px", 
          width: "100%",
          maxWidth: "1100px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>Menu Items</h2>
          
          {loading && <p style={{ textAlign: "center" }}>Loading menu items...</p>}
          
          {!loading && menus.length === 0 && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>No menu items found.</p>
              <button 
                onClick={() => navigate("/core/admin/addmenu")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#3498db",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "15px",
                  fontWeight: "bold"
                }}
              >
                Add New Menu Item
              </button>
            </div>
          )}
          
          {!loading && menus.length > 0 && (
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f39c12", color: "#fff" }}>
                    <th style={{ padding: "12px", textAlign: "center" }}>Image</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Price</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Category</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Stock</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu._id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "12px" }}>
                        <img
                          src={
                            menu.imageUrl
                              ? menu.imageUrl.startsWith("http")
                                ? menu.imageUrl
                                : `https://koreconnect.onrender.com${menu.imageUrl}`
                              : placeholderUrls.thumbnail
                          }
                          alt={menu.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                          onError={(e) => handleImageError(e, "50", "No Image")}
                        />
                      </td>
                      <td style={{ padding: "12px" }}>{menu.name}</td>
                      <td style={{ padding: "12px" }}>₹{menu.price}</td>
                      <td style={{ padding: "12px" }}>{menu.category}</td>
                      <td style={{ padding: "12px" }}>{menu.stock}</td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() => handleEdit(menu)}
                          style={{
                            padding: "7px 12px",
                            backgroundColor: "#3498db",
                            color: "#fff",
                            border: "none",
                            borderRadius: "3px",
                            marginRight: "8px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menu._id)}
                          style={{
                            padding: "7px 12px",
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

export default AdminViewMenu; 