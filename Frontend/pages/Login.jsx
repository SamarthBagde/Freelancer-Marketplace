import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPssword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email + " " + password);
    if (!email || !password) {
      console.log("Enter email or password correctlly");
      return;
    }
    const role = "client";
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
        console.log("Login successfully");
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
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
        </div>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
