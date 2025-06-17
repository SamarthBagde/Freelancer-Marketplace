import { Link } from "react-router-dom";
import style from "../style/NavBar.module.css";

const NavBarClient = () => {
  return (
    <>
      <div className={style.navBarContainer}>
        <div className={style.left}>
          <div className={style.title}>{title}</div>
        </div>
        <div className={style.right}>
          <div className={style.panel}>
            <Link to={"/client"} className={style.btns}>
              <p>Home</p>
            </Link>{" "}
            <Link className={style.btns}>
              <p>My Profile</p>
            </Link>
          </div>
          <LogoutBtn />
        </div>
      </div>
    </>
  );
};

export default NavBarClient;
