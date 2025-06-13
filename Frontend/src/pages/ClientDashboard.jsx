import { useContext } from "react";
import NavBar from "../components/NavBar";
import PostWorkBtn from "../components/PostWorkBtn.";
import UserContext from "../context/UserContext";
import WorkGrid from "../components/WorkGridClient";

const ClientDashboard = () => {
  const user = useContext(UserContext);
  return (
    <>
      <NavBar title={"Client"} />
      <PostWorkBtn />
      <WorkGrid />
    </>
  );
};

export default ClientDashboard;
