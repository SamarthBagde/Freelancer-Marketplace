import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from "../style/LogoutBtn.module.css";

const LogoutBtn = () => {
  const navigate = useNavigate();
  const handleClick = async () => {
    const isConf = confirm("You want to logout?");
    if (isConf) {
      try {
        const res = await axios.get("http://localhost:3001/api/user/logout", {
          withCredentials: true,
        });
        if (res.status === 200) {
          console.log("User Logout");
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className={style.btnContainer}>
      <button className={style.logoutBtn} onClick={handleClick}>
        Logout
      </button>
    </div>
  );
};

export default LogoutBtn;
