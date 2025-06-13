import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../style/ClientWork.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Applications from "../components/Applications";
import AcceptedApplication from "../components/AcceptedApplication";

const ClientWork = () => {
  const { workId } = useParams(); // extract worKId from url
  const [work, setWork] = useState(null);
  useEffect(() => {
    const getworkInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/work/getWork/${workId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setWork(res.data.data.work);
          // console.log(res.data.data.work);
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getworkInfo();
  }, []);
  return (
    <>
      <div className={style.mainContainer}>
        <div className={style.workInfo}>
          {work ? (
            <div className={style.infoContainer}>
              <div className={style.title}>{work.title}</div>
              <div className={style.title}>{work.description}</div>
              <div className={style.title}>{work.domain}</div>
              <div className={style.title}>{work.skillsRequired}</div>
              <div className={style.title}>{work.budget}</div>
              <div className={style.title}>{work.createdAt}</div>
              <div className={style.title}>{work.deadline}</div>
              <div className={style.title}>{work.status}</div>
            </div>
          ) : (
            <div className={style.infoContainer}>
              <Skeleton height={"28"} />
              <Skeleton height={"28"} width={"70%"} />
              <Skeleton height={"28"} width={"80%"} />
              <Skeleton height={"28"} width={"60%"} />
              <Skeleton height={"28"} />
              <Skeleton height={"28"} width={"80%"} />
            </div>
          )}
        </div>
        <div className={style.freelancerInfo}>
          {work ? (
            work.status === "opne" ? (
              <Applications applications={work.applications} />
            ) : (
              <AcceptedApplication acceptedApplication={work.applications} />
            )
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientWork;
