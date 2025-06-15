import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../style/login.css";
import ErrorMsg from "../components/ErrorMsg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPssword] = useState("");
  const [role, setRole] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigator = useNavigate();

  const handleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email + " " + password + " " + role);
    if (!email.trim() || !password.trim()) {
      console.log("Please enter both email and password.");
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (!role) {
      console.log("Please select a user role.");
      setErrorMsg("Please select a user role.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3001/api/user/login",
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
      setErrorMsg(error.response.data.message);
      console.log(error.response.data);
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="left-side"></div>
        <div className="right-side">
          {errorMsg ? (
            // <div className="error-msg-field">⚠ {errorMsg}</div>
            <ErrorMsg message={errorMsg} />
          ) : (
            <></>
          )}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="text-field">
              <p>Email</p>
              <input
                type="text"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-field">
              <p>Password</p>
              <input
                type={showPass ? "text" : "password"}
                required
                onChange={(e) => setPssword(e.target.value)}
              />
            </div>
            <div className="show-pass-container">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => {
                  setShowPass(!showPass);
                }}
              />
              Show password
            </div>
            <select
              value={role}
              onChange={handleChange}
              className="select-field"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
            <div className="btn-container">
              <button type="submit" className="login-btn">
                Login
              </button>
            </div>
          </form>
          <div className="register-link">
            <p>Don't have an account ?</p>
            <a onClick={() => navigator("/register")}> Register</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
