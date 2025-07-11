import { Link } from "react-router-dom";
import style from "../style/NavBar.module.css";
import LogoutBtn from "./LogoutBtn";

const NavBar = ({ title, homeLink, profileLink }) => {
  return (
    <>
      <div className={style.navBarContainer}>
        <div className={style.left}>
          <div className={style.title}>{title}</div>
        </div>
        <div className={style.right}>
          <div className={style.panel}>
            <Link to={homeLink} className={style.btns}>
              <p>Home</p>
            </Link>{" "}
            <Link to={profileLink} className={style.btns}>
              <p>My Profile</p>
            </Link>
          </div>
          <LogoutBtn />
        </div>
      </div>
    </>
  );
};

export default NavBar;
