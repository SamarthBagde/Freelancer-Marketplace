import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../style/ClientWork.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Applications from "../components/Applications";
import AcceptedApplication from "../components/AcceptedApplication";
import { useNavigate } from "react-router-dom";
import SuccessMsg from "../components/SuccessMsg";
import WorkEdit from "../components/WorkEdit";
import NavBar from "../components/NavBar";

const ClientWork = () => {
  const { workId } = useParams(); // extract worKId from url
  const [work, setWork] = useState(null);
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const getworkInfo = async () => {
      try {
        const res = await axios.get(`/work/getWork/${workId}`, {
          withCredentials: true,
        });

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
        const res = await axios.delete(`/work/deleteWork/${workId}`, {
          withCredentials: true,
        });

        if (res.status === 204) {
          console.log("Work delete successfully.");
          navigate("/client");
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
          `/work/closeWork/${workId}`,
          {
            status: work.status,
          },
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setSuccessMsg("Work closed successfully.");
          setTimeout(() => setSuccessMsg(""), 3000);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    }
  };

  const onClickEdit = async () => {
    setIsEditing(true);
  };

  return (
    <>
      {isEditing && <WorkEdit setIsEditing={setIsEditing} work={work} />}
      <NavBar
        title={"Work"}
        homeLink={"/client"}
        profileLink={"/client/profile"}
      />
      <div className={style.mainContainer}>
        <div className={style.workInfo}>
          {work ? (
            <div className={style.infoContainer}>
              {successMsg && <SuccessMsg message={successMsg} />}
              <div className={style.text}>Title : {work.title}</div>
              <div className={style.text}>Description : {work.description}</div>
              <div className={style.text}> Domain : {work.domain}</div>
              <div className={style.text}>Skills : {work.skillsRequired} </div>
              <div className={style.text}>Budget : {work.budget}</div>
              <div className={style.text}>
                {" "}
                Start Date :{" "}
                {new Date(work.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
              </div>
              <div className={style.text}>
                Deadline :{" "}
                {new Date(work.deadline).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className={style.text}>Status : {work.status}</div>

              <div className={style.btnContainer}>
                <button onClick={onClickDelete} className={style.deleteBtn}>
                  Delete work
                </button>
                {work.status === "open" || work.status === "in progress" ? (
                  <button onClick={onClickClose} className={style.closeBtn}>
                    Close work
                  </button>
                ) : (
                  <></>
                )}

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
