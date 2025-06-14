import axios from "axios";
import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import styles from "../style/uploadWork.module.css";

const UploadWork = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [budget, setBudget] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const user = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const id = user?._id;
    setErrorMsg("");

    if (!title || !description || !domain || budget <= 0 || !id) {
      setErrorMsg("Please fill in all required fields correctly.");
      return;
    }

    if (skillsRequired.length === 0) {
      setErrorMsg("Enter at least one skill.");
      return;
    }

    if (new Date(deadline).getTime() <= Date.now()) {
      setErrorMsg("Deadline must be a future date.");
      return;
    }

    const data = {
      title,
      description,
      domain,
      skillsRequired,
      budget,
      deadline,
      owner: id,
    };

    try {
      const res = await axios.post("http://localhost:3001/work/addwork", data, {
        withCredentials: true,
      });

      if (res.status === 201) {
        console.log("Work added");
        // Optionally reset the form
        setTitle("");
        setDescription("");
        setDomain("");
        setSkillsRequired([]);
        setBudget(0);
        setDeadline("");
        setErrorMsg("");
      } else {
        setErrorMsg("Unexpected response. Try again.");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

      <div className={styles.formGroup}>
        <p>Work title :</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <p>Work description :</p>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <p>Domain :</p>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <p>Skills required (comma-separated):</p>
        <input
          type="text"
          onChange={(e) => {
            const input = e.target.value;
            const skills = input
              .split(",")
              .map((i) => i.trim())
              .filter((i) => i.length > 0);
            setSkillsRequired(skills);
          }}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <p>Budget :</p>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <p>Deadline :</p>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Upload
      </button>
    </form>
  );
};

export default UploadWork;
