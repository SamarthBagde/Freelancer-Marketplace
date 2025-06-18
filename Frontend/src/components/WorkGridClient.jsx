import React, { useEffect, useContext, useState } from "react";
import WorkCardClient from "./WorkCard";
import style from "../style/WorkGrid.module.css";
import axios from "axios";
import UserContext from "../context/UserContext";
import NoDataMsg from "./NoDataMsg";

const WorkGridClient = () => {
  const [data, setData] = useState(null);
  const user = useContext(UserContext);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/work/getWorks?owner=${user._id}`, {
          withCredentials: true,
        });

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
    <div className={style.gridConatainer}>
      {data && data.length > 0 ? (
        data.map((work) => (
          <WorkCardClient
            redirectTo={`/client/work/${work._id}`}
            work={work}
            key={work._id}
          />
        ))
      ) : (
        <NoDataMsg
          title={"No Works Found"}
          message={'Click on "Post Work" to create your first listing.'}
        />
      )}
    </div>
  );
};

export default WorkGridClient;
