import React from "react";
import style from "../style/NotFoundErrorPage.module.css";

const NotFoundErrorPage = () => {
  return (
    <>
      <div className={style.mainContainer}>
        <h1>404</h1>
        <div className={style.text}>Page Not Found.</div>
      </div>
    </>
  );
};

export default NotFoundErrorPage;
