import axios from "axios";
import { useState } from "react";
import style from "../style/UploadWork.module.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const UploadWork = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [budget, setBudget] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!title || !description || !domain || budget <= 0) {
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
    };

    try {
      const res = await axios.post("/work/addwork", data, {
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
        navigate("/client");
      } else {
        setErrorMsg("Unexpected response. Try again.");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Server error");
      console.log(error);
    }
  };

  return (
    <div>
      <NavBar
        title={"Upload Work"}
        homeLink={"/client"}
        profileLink={"/client/profile"}
      />
      <form onSubmit={handleSubmit} className={style.formContainer}>
        {errorMsg && <div className={style.errorMsg}>{errorMsg}</div>}

        <div className={style.formGroup}>
          <p>Work title :</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={style.formGroup}>
          <p>Work description :</p>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className={style.formGroup}>
          <p>Domain :</p>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </div>

        <div className={style.formGroup}>
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

        <div className={style.formGroup}>
          <p>Budget :</p>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>

        <div className={style.formGroup}>
          <p>Deadline :</p>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={style.submitButton}>
          Upload
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default UploadWork;
