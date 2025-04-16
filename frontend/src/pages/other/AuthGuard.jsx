import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      navigate("/login", { replace: true });
    }
  }, [authToken, navigate]);

  return authToken ? children : null;
};

export default ProtectedRoute;