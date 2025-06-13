import React, { useEffect, useContext, useState } from "react";
import WorkCardClient from "./WorkCardClient";
import style from "../style/WorkGrid.module.css";
import axios from "axios";
import UserContext from "../context/UserContext";

const WorkGrid = () => {
  const [data, setData] = useState(null);
  const user = useContext(UserContext);
  useEffect(() => {
    const getData = async () => {
      try {
        // console.log(`http://localhost:3001/work/getWorks/${user._id}`);
        const res = await axios.get(
          `http://localhost:3001/work/getWorks/${user._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setData(res.data.data.works);
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };

    getData();
  }, []);

  return (
    <div className={style.gridConatiner}>
      {data ? (
        data.map((work, idx) => <WorkCardClient work={work} key={idx} />)
      ) : (
        <div>Loading data</div>
      )}
    </div>
  );
};

export default WorkGrid;
