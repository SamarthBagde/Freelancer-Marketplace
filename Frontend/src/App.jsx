import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FreelancerDashboard from "./pages/FreelancerDashborad";
import LandingPage from "./pages/Landingpage";
import UploadWork from "./pages/UploadWork";
import NotFoundErrorPage from "./pages/NotFoundErrorPage";
import ClientWork from "./pages/ClientWork";
import FreelancerWork from "./pages/FreelancerWork";
import FreelancerProfile from "./pages/FreelancerProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client routes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRole={"client"}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/work/:workId"
          element={
            <ProtectedRoute allowedRole={"client"}>
              <ClientWork />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client/post-work"
          element={
            <ProtectedRoute allowedRole={"client"}>
              <UploadWork />
            </ProtectedRoute>
          }
        />

        {/* Freelancer routes */}
        <Route
          path="/freelancer"
          element={
            <ProtectedRoute allowedRole={"freelancer"}>
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/profile"
          element={
            <ProtectedRoute allowedRole={"freelancer"}>
              <FreelancerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer/work/:workId"
          element={
            <ProtectedRoute allowedRole={"freelancer"}>
              <FreelancerWork />
            </ProtectedRoute>
          }
        />

        {/* 404 error handling route */}
        <Route path="*" element={<NotFoundErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
