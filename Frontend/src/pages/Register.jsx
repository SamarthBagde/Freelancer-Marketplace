import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("");
  const [skills, setSkills] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !rePassword.trim() ||
      name.length < 3 ||
      phone.length != 10
    ) {
      console.log("Enter inpute correctlly");
      setErrorMsg("Enter inpute correctlly.");
      return;
    }

    if (!role) {
      console.log("Please select a user role.");
      setErrorMsg("Please select a user role.");
      return;
    }

    if (role === "freelancer") {
      if (!domain.trim() || skills.length === 0) {
        console.log("Enter inpute correctlly");
        setErrorMsg("Enter inpute correctlly.");
        return;
      }
    }

    if (password !== rePassword) {
      console.log("Check you password again");
      setErrorMsg("Check you password again.");
      return;
    }

    let data = {
      name,
      email,
      password,
      phone,
      role,
    };
    if (role === "freelancer") {
      data.profile = {
        domain,
        skills,
      };
    }

    console.log(data);

    try {
      const res = await axios.post(
        "http://localhost:3001/user/register",
        data,
        { withCredentials: true }
      );
      if (res.status === 201) {
        console.log("User regisetred");
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
      setErrorMsg(error.response.data);
    }
  };

  return (
    <>
      <div className="main-container">
        <div className="left-side"></div>
        <div className="right-side">
          {errorMsg ? (
            <div className="error-msg-field">⚠ {errorMsg}</div>
          ) : (
            <></>
          )}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="text-field">
              <p>Name : </p>
              <input
                type="text"
                required
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="text-field">
              <p>Email : </p>
              <input
                type="text"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="text-field">
              <p>Password : </p>
              <input
                type={showPass ? "text" : "password"}
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
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
            <div className="text-field">
              <p>Confirm Password : </p>
              <input
                type="password"
                required
                onChange={(e) => {
                  setRePassword(e.target.value);
                }}
              />
            </div>
            <div className="text-field">
              <p>Phone : </p>
              <input
                type="number"
                required
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
              />
            </div>

            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
              className="select-field"
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>

            {role === "freelancer" ? (
              <>
                <div className="text-field">
                  <p>Domain : </p>
                  <input
                    type="text"
                    required
                    onChange={(e) => {
                      setDomain(e.target.value);
                    }}
                  />
                </div>
                <div className="text-field">
                  <p>Skills : </p>
                  <input
                    type="text"
                    required
                    onChange={(e) => {
                      const input = e.target.value;
                      const data = input
                        .split(",")
                        .map((i) => i.trim())
                        .filter((i) => i.length > 0);

                      setSkills(data);
                    }}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="btn-container">
              <button type="submit" className="register-btn">
                Register as {role}
              </button>
            </div>
          </form>
          <div className="register-link">
            <p>Already have an account ?</p>
            <a onClick={() => navigator("/login")}> Login</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
