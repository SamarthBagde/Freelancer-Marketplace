import React from "react";
import style from "../style/WorkCard.module.css";
import { Link } from "react-router-dom";

const WorkCard = ({ redirectTo, work }) => {
  return (
    <Link to={redirectTo} className={style.card}>
      <div>
        <h3 className={style.title}>{work.title}</h3>
        <p className={style.domain}>Domain: {work.domain}</p>
        <p className={style.budget}>Budget: ₹{work.budget}</p>
        <p className={style.deadline}>Deadline: {work.deadline}</p>
        <p className={style.deadline}>Status: {work.status}</p>
      </div>
    </Link>
  );
};

export default WorkCard;
