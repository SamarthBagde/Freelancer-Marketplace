import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = async () => {
  try {
    const res = await axios.get("http://localhost:3001/user/auth/check", {
      withCredentials: true,
    });

    return res.status === 200 && res.data.authenticated === true;
  } catch (error) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      setAuth(isAuth);
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <p>Loading...</p>;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
