import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../style/Applications.module.css";

const AcceptedApplication = ({ acceptedApplication }) => {
  //   console.log(acceptedApplication);
  const [freelancer, setFreealancer] = useState(null);
  const [skills, setSkills] = useState([]);
  useEffect(() => {
    const getFreelancer = async () => {
      const accepteFreelancer = acceptedApplication.filter(
        (app) => app.status === "accepted"
      );
      //   console.log(accepteFreelancer[0].freelancers);
      try {
        const res = await axios.get(
          `/user/getUser/${accepteFreelancer[0].freelancerId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setFreealancer(res.data.data.user);
          setSkills(res.data.data.user.profile.skills);
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFreelancer();
  }, []);
  return freelancer ? (
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
      <p>Status : Hired</p>
    </div>
  ) : (
    <></>
  );
};

export default AcceptedApplication;
