import { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";

const Browse = () => {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    // Fetch menu items (or categories) from the API
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("/menu");
        setItems(response.data.items);  // Assuming the response has items array
      } catch (error) {
        console.error("Error fetching menu items:", error.message);
      }
    };
    fetchMenuItems();
  }, []);

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {items.length === 0 ? (
          <p>No items available</p>
        ) : (
          items.map((item) => (
            <li key={item.id}>
              {item.name} - {item.description}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Browse;
