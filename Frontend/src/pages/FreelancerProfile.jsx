import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import style from "../style/FreelancerProfile.module.css";
import axios from "axios";
import NavBar from "../components/NavBar";

const Card = ({ work }) => {
  return (
    <div className={style.card}>
      <div className={style.title}>{work.title}</div>
      <div>Domain : {work.domain}</div>
      <div>status : {work.status}</div>
    </div>
  );
};

const FreelancerProfile = () => {
  const [currentWorks, setCurrentWorks] = useState();
  const [workHistorys, setWorkHistorys] = useState();
  const user = useContext(UserContext);

  useEffect(() => {
    const getCurrentWorks = async () => {
      const currentWorkIds = user.currentWork;
      try {
        const res = await Promise.all(
          currentWorkIds.map((id) =>
            axios.get(`http://localhost:3001/api/work/getWork/${id}`, {
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
            axios.get(`http://localhost:3001/api/work/getWork/${id}`, {
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
  }, []);
  return (
    <>
      <NavBar
        title={"User Profile"}
        homeLink={"/freelancer"}
        profileLink={"/freelancer/profile"}
      />
      <div className={style.mainContainer}>
        <div className={style.userInfo}>
          <div className={style.leftSide}>
            <div className={style.textField}>Name : {user.name}</div>
            <div className={style.textField}>Email : {user.email}</div>
            <div className={style.textField}>phone : {user.phone}</div>
            <div className={style.textField}>
              Domain : {user.profile.domain}
            </div>
            <div className={style.textField}>
              Skills :{" "}
              {user.profile.skills.map((skill) => (
                <div className={style.skill}>{skill}</div>
              ))}
            </div>
            <div className={style.btnContainer}>
              <button>Edit</button>
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
              <div>No work in process right now</div>
            )}
          </div>
        </div>
        <div className={style.workContainer}>
          <div className={style.title}>Work History</div>
          <div className={style.gridContainer}>
            {workHistorys && workHistorys.length > 0 ? (
              workHistorys.map((work) => <Card work={work} key={work._id} />)
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FreelancerProfile;
