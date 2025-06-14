import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../../style/WorkGrid.module.css";
import WorkCard from "../WorkCard";

const WorkGridFreelancer = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/work/getWorks?status=open",
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setData(res.data.data.works);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    getData();
  }, []);
  return (
    <div className={style.gridConatainer}>
      {data ? (
        data.map((work) => (
          <WorkCard
            work={work}
            redirectTo={`/freelancer/work/${work._id}`}
            key={work._id}
          />
        ))
      ) : (
        <div>Loading data WorkGridFreelancer</div>
      )}
    </div>
  );
};

export default WorkGridFreelancer;
