import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("client");
  const [domain, setDomain] = useState("");
  const [skills, setSkills] = useState([]);

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
      return;
    }

    if (role === "freelancer") {
      if (!domain.trim() || skills.length === 0) {
        console.log("Enter inpute correctlly");
        return;
      }
    }

    if (password !== rePassword) {
      console.log("Check you password again");
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
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Name : </p>
          <input
            type="text"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Email : </p>
          <input
            type="text"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Password : </p>
          <input
            type="password"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>{" "}
        <div>
          <p>Confirm Password : </p>
          <input
            type="password"
            required
            onChange={(e) => {
              setRePassword(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Phone : </p>
          <input
            type="number"
            required
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </div>
        <div>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>
        {role === "freelancer" ? (
          <>
            <div>
              <p>Domain : </p>
              <input
                type="text"
                required
                onChange={(e) => {
                  setDomain(e.target.value);
                }}
              />
            </div>
            <div>
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
        <br />
        <button type="submit">Register as {role}</button>
        <br />
        <br />
        <div onClick={() => navigator("/login")}>Login</div>
      </form>
    </>
  );
};

export default Register;
