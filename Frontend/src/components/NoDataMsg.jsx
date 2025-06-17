import style from "../style/Messages.module.css";

const NoDataMsg = ({ title, message }) => {
  return (
    <div className={style.noDataMessage}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
};

export default NoDataMsg;
