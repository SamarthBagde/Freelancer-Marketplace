import { useState } from "react";
import style from "../style/ProfileEdit.module.css";
import ErrorMsg from "./ErrorMsg";
import axios from "axios";

const WorkEdit = ({ setIsEditing, work }) => {
  const [title, setTitle] = useState(work.title);
  const [description, setDescription] = useState(work.description);
  const [domain, setDomain] = useState(work.domain);
  const [budget, setBudget] = useState(work.budget);
  const [deadline, setDeadline] = useState(work.deadline.split("T")[0]);
  const [skillsRequired, setSkillsRequired] = useState(work.skillsRequired);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    const data = {
      title,
      description,
      domain,
      budget,
      deadline,
      skillsRequired,
    };

    try {
      const res = await axios.patch(`/work/updateWork/${work._id}`, data, {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log("Updated");
        setErrorMsg("");
        setIsEditing(false);
      }
    } catch (error) {
      setErrorMsg(error.response.data.message);
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
          <p>Title :</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>{" "}
        <div className={style.formGroup}>
          <p>Description :</p>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>{" "}
        <div className={style.formGroup}>
          <p>Domain :</p>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>{" "}
        <div className={style.formGroup}>
          <p>Skills Required :</p>
          <input
            type="text"
            value={skillsRequired.join(", ")}
            onChange={(e) => {
              const input = e.target.value;

              const data = input
                .split(",")
                .map((i) => i.trim())
                .filter((i) => i.length != 0);
              setSkillsRequired(data);
            }}
          />
        </div>
        <div className={style.formGroup}>
          <p>Budget :</p>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
        <div className={style.formGroup}>
          <p>Deadline :</p>
          <input
            type="date"
            value={deadline.toString()}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>{" "}
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

export default WorkEdit;
