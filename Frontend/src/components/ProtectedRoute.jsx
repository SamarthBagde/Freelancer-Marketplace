import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const isAuthenticated = async () => {
  try {
    const res = await axios.get("http://localhost:3001/api/user/auth/check", {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    console.log(error.response.data);
    return false;
  }
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const [user, setUser] = useState();
  const [auth, setAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await isAuthenticated();
      if (res && res.data) {
        setAuth(res.data.authenticated);
        setUserRole(res.data.userRole);
        setUser(res.data.user);
      } else {
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) {
    return <p>Loading - Protected Route</p>;
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
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default ProtectedRoute;
