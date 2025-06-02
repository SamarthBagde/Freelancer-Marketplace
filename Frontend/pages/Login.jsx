import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPssword] = useState("");
  const [role, setRole] = useState("client");

  const navigator = useNavigate();

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email + " " + password + " " + role);
    if (!email.trim() || !role || !password.trim()) {
      console.log("Enter email or password correctlly");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3001/user/login",
        {
          email,
          password,
          role,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        const role = res.data.data.user.role;

        if (role === "client") {
          navigator("/client");
        } else if (role === "freelancer") {
          navigator("/freelancer");
        }
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <p>email</p>
          <input
            type="text"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <p>password</p>
          <input
            type="password"
            required
            onChange={(e) => setPssword(e.target.value)}
          />
        </div>{" "}
        <select value={role} onChange={handleChange}>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
        </select>
        <br />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
