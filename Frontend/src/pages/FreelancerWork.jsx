import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../style/FreelancerWork.module.css";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ErrorMsg from "../components/ErrorMsg";

const FreelancerWork = () => {
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const user = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getWork = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/work/getWork/${workId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setWork(res.data.data.work);
        }
      } catch (error) {
        console.log(error.response.data);
        setErrorMsg(error.response.data.message);
      }
    };

    getWork();
  }, []);

  const handleOnClick = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/work/${workId}/apply`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        console.log("Applyed successfully");
        navigate("/freelancer");
      }
    } catch (error) {
      console.log(error.response.data);
      setErrorMsg(error.response.data.message);
    }
  };

  return (
    <div className={style.mainContainer}>
      {work ? (
        <div className={style.workCard}>
          <div className={style.errorRow}>
            {errorMsg ? <ErrorMsg message={errorMsg} /> : <></>}
          </div>
          <div className={style.infoRow}>Title: {work.title}</div>
          <div className={style.infoRow}>Description: {work.description}</div>
          <div className={style.infoRow}>Domain: {work.domain}</div>
          <div className={style.infoRow}>Skills: {work.skillsRequired}</div>
          <div className={style.infoRow}>Budget: {work.budget}</div>
          <div className={style.infoRow}>Start Date: {work.createdAt}</div>
          <div className={style.infoRow}>Deadline: {work.deadline}</div>
          <div className={style.infoRow}>Status: {work.status}</div>

          <div className={style.btnContainer}>
            <button onClick={handleOnClick}>Apply</button>
          </div>
        </div>
      ) : (
        <div>Loading data - Freelancer Work</div>
      )}
    </div>
  );
};

export default FreelancerWork;
