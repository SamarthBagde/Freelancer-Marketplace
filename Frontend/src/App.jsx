import ProtectedRoute from "../components/ProtectedRoute";
import ClientDashboard from "../pages/ClientDashboard";
import FreelancerDashboard from "../pages/FreelancerDashborad";
import Login from "../pages/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/freelancer"
          element={
            <ProtectedRoute>
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
