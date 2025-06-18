import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "../style/WorkGrid.module.css";
import WorkCard from "./WorkCard";
import SearchBar from "./SearchBar";
import NoDataMsg from "./NoDataMsg";

const WorkGridFreelancer = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("/work/getWorks?status=open", {
          withCredentials: true,
        });

        if (res.status === 200) {
          setData(res.data.data.works);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    getData();
  }, [setData]);
  return (
    <>
      {" "}
      <SearchBar setData={setData} />
      <div className={style.gridConatainer}>
        {data && data.length > 0 ? (
          data.map((work) => (
            <WorkCard
              work={work}
              redirectTo={`/freelancer/work/${work._id}`}
              key={work._id}
            />
          ))
        ) : (
          <NoDataMsg
            title={"No job listings yet"}
            message={"New opportunities are posted regularly — stay tuned!"}
          />
        )}
      </div>
    </>
  );
};

export default WorkGridFreelancer;
