import { useContext, useState } from "react";
import style from "../style/ProfileEdit.module.css";
import UserContext from "../context/UserContext";
import ErrorMsg from "./ErrorMsg";
import axios from "axios";

const ProfileEdit = ({ setIsEditing }) => {
  const user = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [domain, setDomain] = useState(user.profile.domain);
  const [skills, setSkills] = useState(user.profile.skills);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    const data = { name, phone };
    if (user.role === "freelancer") {
      if (domain) data.domain = domain;
      if (skills && skills.length > 0) data.skills = skills;
    }
    console.log(data);

    try {
      const res = await axios.patch("/user/updateProfile", data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log("Updated");
        setErrorMsg("");
        setIsEditing(false);
      }
    } catch (error) {
      setErrorMsg(error.response.data);
    }
  };

  return (
    <div className={style.overlay}>
      <div className={style.formConatiner}>
        <div className={style.closeBtnContainer}>
          <button
            onClick={() => {
              setIsEditing(false);
            }}
            className={style.closeBtn}
          >
            X
          </button>
        </div>
        <div className={style.centerDiv}>
          {errorMsg && <ErrorMsg message={errorMsg} />}
        </div>
        <div className={style.formGroup}>
          <p>Name :</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>{" "}
        <div className={style.formGroup}>
          <p>Phone :</p>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>{" "}
        {user.role === "freelancer" ? (
          <>
            <div className={style.formGroup}>
              <p>Domain :</p>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>{" "}
            <div className={style.formGroup}>
              <p>Skills :</p>
              <input
                type="text"
                value={skills}
                onChange={(e) => {
                  const input = e.target.value;

                  const data = input
                    .split(",")
                    .map((i) => i.trim())
                    .filter((i) => i.length != 0);
                  setSkills(data);
                }}
              />
            </div>
          </>
        ) : (
          <></>
        )}
        <button
          onClick={handleSubmit}
          type="submit"
          className={style.updateBtn}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
