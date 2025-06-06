import axios from "axios";
import React, { useState } from "react";

const UploadWork = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("");
  const [skillsRequired, setSkillsRequired] = useState([]);
  const [budget, setBudget] = useState(0);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !domain || budget <= 0) {
      console.log("Enter input correctlly");
      return;
    }

    if (skillsRequired.length === 0) {
      console.log("Enter data correctlly in skillsRequired filed");
      return;
    }

    if (new Date(deadline).getTime() <= Date.now()) {
      console.log("Invalid deadline is entered");
      return;
    }

    const deadlineDate = new Date(deadline).getTime();

    // console.log(
    //   Math.floor((deadlineDate - Date.now()) / (1000 * 60 * 60 * 24))
    // );

    const data = {
      title,
      description,
      domain,
      skillsRequired,
      budget,
      deadline,
    };

    console.log(data);

    try {
      const res = await axios.post("http://localhost:3001/work/addwork", data, {
        withCredentials: true,
      });

      if (res.status === 201) {
        console.log("Work added");
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
          <p>Work title : </p>
          <input
            type="text"
            required
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Work description : </p>
          <input
            type="text"
            required
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
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
          <p>Skills required : </p>
          <input
            type="text"
            required
            onChange={(e) => {
              const input = e.target.value;

              const skills = input
                .split(",")
                .map((i) => i.trim())
                .filter((i) => i.length > 0);

              setSkillsRequired(skills);
            }}
          />
        </div>
        <div>
          <p>Budget : </p>
          <input
            type="number"
            required
            onChange={(e) => {
              setBudget(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Deadline : </p>
          <input
            type="date"
            required
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
          />
        </div>

        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default UploadWork;
