import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WorkGridFreelancer from "../components/WorkGridFreelancer";

const FreelancerDashboard = () => {
  return (
    <>
      <NavBar
        title="Freelancer"
        homeLink={"/freelancer"}
        profileLink={"/freelancer/profile"}
      />
      <WorkGridFreelancer />
      <Footer />
    </>
  );
};

export default FreelancerDashboard;
