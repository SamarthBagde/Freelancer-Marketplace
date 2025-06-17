import React from "react";
import style from "../style/PostWork.module.css";
import { useNavigate, Link } from "react-router-dom";

const PostWorkBtn = () => {
  const navigator = useNavigate();

  return (
    <div className={style.mainContainer}>
      <div className={style.conatiner}>
        <h1>Need a freelancer? Post your project now!</h1>

        <Link to={"/client/post-work"} className={style.btn}>
          Post a job
        </Link>
      </div>
    </div>
  );
};

export default PostWorkBtn;
