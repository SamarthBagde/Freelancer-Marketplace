import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "../style/Applications.module.css";
import { useParams } from "react-router-dom";

const Card = ({ freelancer, workId }) => {
  const skills = freelancer.profile.skills;

  const handleOnClick = async (freelancerId) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/work/${workId}/accept`,
        {
          freelancerId,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        console.log("You are hired !!");
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className={style.card}>
      <h3>{freelancer.name}</h3>
      <p>Domain : {freelancer.profile.domain}</p>

      <div className={style.skills}>
        Skills :
        {skills.length > 0 ? (
          skills.map((skill, ind) => <div key={ind}>{skill}</div>)
        ) : (
          <></>
        )}
      </div>
      <p>Email: {freelancer.email}</p>
      <p>Contact : {freelancer.phone}</p>

      <div className={style.btnContainer}>
        {freelancer.status === "open" ? (
          <button
            onClick={() => {
              handleOnClick(freelancer._id);
            }}
            className={style.acceptBtn}
          >
            Accept
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const Applications = ({ applications }) => {
  const { workId } = useParams();
  const [freelancers, setFreealancers] = useState({});
  useEffect(() => {
    const getFreelancers = async () => {
      const ids = applications.map((a) => a.freelancers);
      try {
        const response = await Promise.all(
          ids.map((id) =>
            axios.get(`http://localhost:3001/user/getUser/${id}`, {
              withCredentials: true,
            })
          )
        );

        const freelancerMap = {}; // Map for freelancers

        response.forEach((res, ind) => {
          //   console.log(res.data.data.user);
          freelancerMap[ids[ind]] = res.data.data.user;
        });

        setFreealancers(freelancerMap);
      } catch (error) {
        console.log(Error.response.data);
      }
    };

    if (applications.length > 0) getFreelancers();
  }, [applications]);
  return (
    <div className={style.mainContainer}>
      {applications.length > 0 ? (
        applications.map((a, ind) => {
          const freelancer = freelancers[a.freelancers];
          return freelancer ? (
            <Card workId={workId} key={ind} freelancer={freelancer} />
          ) : (
            <div key={ind}>Loading - Applications</div>
          );
        })
      ) : (
        <div>No Application yet</div>
      )}
    </div>
  );
};

export default Applications;
