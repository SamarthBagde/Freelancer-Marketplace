import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import FreelancerDashboard from "./pages/FreelancerDashborad";
import LandingPage from "./pages/Landingpage";
import UploadWork from "./pages/UploadWork";
import NotFoundErrorPage from "./pages/NotFoundErrorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRole={"client"}>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer"
          element={
            <ProtectedRoute allowedRole={"freelancer"}>
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/upload-work" element={<UploadWork />} />

        {/* 404 error handling route */}
        <Route path="*" element={<NotFoundErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
