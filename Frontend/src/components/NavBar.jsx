import style from "../style/NavBar.module.css";

const NavBar = ({ title }) => {
  return (
    <>
      <div className={style.navBarContainer}>
        <div className={style.left}>
          <div className={style.title}>{title}</div>
        </div>
        <div className={style.right}>
          <div className={style.panel}>
            <p>Home</p>
            <p>My Profile</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
