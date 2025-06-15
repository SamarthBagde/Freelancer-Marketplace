import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../style/ClientWork.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Applications from "../components/Applications";
import AcceptedApplication from "../components/AcceptedApplication";
import UserContext from "../context/UserContext";

const ClientWork = () => {
  const { workId } = useParams(); // extract worKId from url
  const [work, setWork] = useState(null);
  const user = useContext(UserContext);
  useEffect(() => {
    const getworkInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/work/getWork/${workId}`,
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

  const onClickDelete = async () => {
    const isConfirm = confirm("You want to delete this work");

    if (isConfirm) {
      try {
        const res = await axios.delete(
          `http://localhost:3001/api/work/deleteWork/${workId}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 204) {
          console.log("Work delete successfully.");
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  const onClickClose = async () => {
    const isConfirm = confirm("You want to close this work");
    if (isConfirm) {
      try {
        const res = await axios.post(
          `http://localhost:3001/api/work/closeWork/${workId}`,
          {
            status: work.status,
          },
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          console.log("Work closed successfully.");
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  const onClickEdit = async () => {
    console.log("Yet to work on it, wait ");
  };

  return (
    <>
      <div className={style.mainContainer}>
        <div className={style.workInfo}>
          {work ? (
            <div className={style.infoContainer}>
              <div className={style.text}>Title : {work.title}</div>
              <div className={style.text}>Description : {work.description}</div>
              <div className={style.text}> Domain : {work.domain}</div>
              <div className={style.text}>Skills : {work.skillsRequired} </div>
              <div className={style.text}>Budget : {work.budget}</div>
              <div className={style.text}> Start Date : {work.createdAt} </div>
              <div className={style.text}>Deadline : {work.deadline}</div>
              <div className={style.text}>Status : {work.status}</div>

              <div className={style.btnContainer}>
                <button onClick={onClickDelete} className={style.deleteBtn}>
                  Delete work
                </button>
                <button
                  disabled={
                    work.status === "completed" || work.status === "cancelled"
                  }
                  onClick={onClickClose}
                  className={style.closeBtn}
                >
                  Close work
                </button>
                <button onClick={onClickEdit} className={style.editBtn}>
                  Edit work
                </button>
              </div>
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
            work.status === "open" ? (
              <Applications applications={work.applications} />
            ) : (
              <AcceptedApplication acceptedApplication={work.applications} />
            )
          ) : (
            <div>Loading - Client work</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientWork;
