import style from "../style/Messages.module.css";
const SuccessMsg = ({ message }) => {
  if (!message) return null;

  return <div className={style.successToast}>{message}</div>;
};

export default SuccessMsg;
