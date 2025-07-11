import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import style from "../style/UserProfile.module.css";
import axios from "axios";
import NavBar from "../components/NavBar";
import NoDataMsg from "../components/NoDataMsg";
import ProfileEdit from "../components/ProfileEdit";

const Card = ({ work }) => {
  return (
    <div className={style.card}>
      <div className={style.title}>{work.title}</div>
      <div>Domain : {work.domain}</div>
      <div>status : {work.status}</div>
    </div>
  );
};

const UserProfile = () => {
  const [currentWorks, setCurrentWorks] = useState();
  const [workHistorys, setWorkHistorys] = useState();
  const user = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    const getCurrentWorks = async () => {
      const currentWorkIds = user.currentWork;
      try {
        const res = await Promise.all(
          currentWorkIds.map((id) =>
            axios.get(`/work/getWork/${id}`, {
              withCredentials: true,
            })
          )
        );

        let data = res.map((r) => r.data.data.work);
        setCurrentWorks(data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    const getWorkHistory = async () => {
      const WorkHistoryIds = user.workHistory;
      try {
        const res = await Promise.all(
          WorkHistoryIds.map((id) =>
            axios.get(`/work/getWork/${id}`, {
              withCredentials: true,
            })
          )
        );
        let data = res.map((r) => r.data.data.work);
        setWorkHistorys(data);
      } catch (error) {
        console.log(error.response.data);
      }
    };

    getCurrentWorks();
    getWorkHistory();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditing]);
  return (
    <>
      {isEditing && <ProfileEdit setIsEditing={setIsEditing} />}
      <NavBar
        title={"User Profile"}
        homeLink={`/${user.role}`}
        profileLink={`/${user.role}/profile`}
      />
      <div className={style.mainContainer}>
        <div className={style.userInfo}>
          <div className={style.leftSide}>
            <div className={style.textField}>Name : {user.name}</div>
            <div className={style.textField}>Email : {user.email}</div>
            <div className={style.textField}>phone : {user.phone}</div>
            {user.role === "freelancer" ? (
              <>
                {" "}
                <div className={style.textField}>
                  Domain : {user.profile.domain}
                </div>
                <div className={style.textField}>
                  Skills :{" "}
                  {user.profile.skills.map((skill, ind) => (
                    <div className={style.skill} key={ind}>
                      {skill}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}
            <div className={style.btnContainer}>
              <button
                onClick={() => {
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className={style.rightSide}>
            <div className={style.avatar}>👤</div>
          </div>
        </div>

        <div className={style.workContainer}>
          <div className={style.title}>Current work</div>
          <div className={style.gridContainer}>
            {currentWorks && currentWorks.length > 0 ? (
              currentWorks.map((work) => <Card work={work} key={work._id} />)
            ) : (
              <NoDataMsg title={"No current jobs"} message={""} />
            )}
          </div>
        </div>
        <div className={style.workContainer}>
          <div className={style.title}>Work History</div>
          <div className={style.gridContainer}>
            {workHistorys && workHistorys.length > 0 ? (
              workHistorys.map((work) => <Card work={work} key={work._id} />)
            ) : (
              <NoDataMsg title={"No work history yet"} message={""} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
