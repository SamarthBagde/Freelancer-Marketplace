import React from "react";
import style from "../style/ErrorMsg.module.css";

const ErrorMsg = ({ message }) => {
  return <div className={style.errorMsgField}>⚠ {message}</div>;
};

export default ErrorMsg;
