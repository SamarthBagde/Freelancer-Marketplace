import React from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const LogoutBtn = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const res = await axios.get("http://localhost:3001/user/logout", {
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log("User Logout");
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <div>
      <button onClick={handleClick}>Logout</button>
    </div>
  );
};

export default LogoutBtn;
