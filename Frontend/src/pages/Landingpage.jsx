import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigator = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3001/user/auth/check", {
          withCredentials: true,
        });

        if (res.status === 200) {
          const role = res.data.userRole || null;

          if (role) {
            setUserRole(role);
            if (role === "client") {
              navigator("/client");
            } else if (role === "freelancer") {
              navigator("/freelancer");
            }
          } else {
            navigator("/login");
          }
        } else {
          navigator("/login");
        }
      } catch (error) {
        navigator("/login");
        console.log(eerror.response.data);
      }
    };

    checkAuth();
  }, [navigator]);

  return <h1></h1>;
};

export default LandingPage;
