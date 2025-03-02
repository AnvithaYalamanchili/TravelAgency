import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import VerifyFacePage from "./VerifyFacePage"; // Import Face Verification Page
import Dashboard from "./Dashboard"; // Import Dashboard Page
import HomePage from "./HomePage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-face" element={<VerifyFacePage />} />  {/* Face Verification Page */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard Page */}
      </Routes>
    </Router>
  );
}

export default App;
