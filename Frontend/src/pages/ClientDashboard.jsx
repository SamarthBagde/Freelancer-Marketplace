import { useContext } from "react";
import NavBar from "../components/NavBar";
import PostWorkBtn from "../components/PostWorkBtn.";
import UserContext from "../context/UserContext";
import WorkGridClient from "../components/WorkGridClient";
import Footer from "../components/Footer";

const ClientDashboard = () => {
  const user = useContext(UserContext);
  return (
    <>
      <NavBar
        title={"Client"}
        homeLink={"/client"}
        profileLink={"/client/profile"}
      />
      <PostWorkBtn />
      <WorkGridClient />
      <Footer />
    </>
  );
};

export default ClientDashboard;
