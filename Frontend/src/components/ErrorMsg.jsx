import style from "../style/Messages.module.css";

const ErrorMsg = ({ message }) => {
  return <div className={style.errorMsgField}>⚠ {message}</div>;
};

export default ErrorMsg;
