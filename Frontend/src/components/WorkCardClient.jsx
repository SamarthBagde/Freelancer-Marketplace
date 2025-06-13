import React from "react";
import style from "../style/WorkCardClient.module.css";
import { Link } from "react-router-dom";

const WorkCardClient = ({ work }) => {
  return (
    <Link to={`/client/work/${work._id}`}>
      <div className={style.card}>
        <h3 className={style.title}>{work.title}</h3>
        <p className={style.domain}>Domain: {work.domain}</p>
        <p className={style.budget}>Budget: ₹{work.budget}</p>
        <p className={style.deadline}>Deadline: {work.deadline}</p>
        <p className={style.deadline}>Status: {work.status}</p>
      </div>
    </Link>
  );
};

export default WorkCardClient;
