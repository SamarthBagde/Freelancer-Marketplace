import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [userRole, setUserRole] = useState(null);

  const navigator = useNavigate();

  const getAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3001/user/auth/check", {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUserRole(res.data.usesRole);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const res = getAuth();

    if (!res) {
      navigator("/login");
    }

    if (userRole) {
      if (userRole === "client") {
        navigator("/client");
      } else if (userRole === "freelancer") {
        navigator("freelancer");
      }
    }
  }, []);

  return (
    <>
      <h1>Welcome to freelancer world</h1>
    </>
  );
};

export default LandingPage;
