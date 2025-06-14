import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import WorkGridFreelancer from "../components/freelancer/WorkGridFreelancer";

const FreelancerDashboard = () => {
  return (
    <>
      <NavBar title="Freelancer" />
      <WorkGridFreelancer />
      <Footer />
    </>
  );
};

export default FreelancerDashboard;
