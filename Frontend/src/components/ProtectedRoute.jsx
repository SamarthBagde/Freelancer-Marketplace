import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const isAuthenticated = async () => {
  try {
    const res = await axios.get("http://localhost:3001/user/auth/check", {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.log(error.response.data);
    return false;
  }
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const [auth, setAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await isAuthenticated();
      if (res && res.data) {
        setAuth(res.data.authenticated);
        setUserRole(res.data.userRole);
      } else {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <p>Loading...</p>;
  }
  // if (auth === null || (auth && allowedRole && userRole === null)) {
  //   return <p>Loading...</p>;
  // }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <p>You are not allowed</p>;
  }
  return children;
};

export default ProtectedRoute;
