import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import VerifyFacePage from "./VerifyFacePage";
import Dashboard from "./Dashboard";
import HomePage from "./HomePage";
import TravelPreferences from "./TravelPreferences";
import TripPage from "./TripPage";
import MatchedUsers from "./MatchedUsers";
import AdminLoginPage from "./AdminLogin";
import Admindashboard from "./admindashboard";
import Locations from "./Locations";
import MatchedPlaces from "./MatchedPlaces";
import InterestRequests from "./InterestRequests";
import WhatsAppLayout from "./WhatsAppLayout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-face" element={<VerifyFacePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/travel-preferences" element={<TravelPreferences />} />
        <Route path="/trip/:destination" element={<TripPage />} />
        <Route path="/matched-users" element={<MatchedUsers />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/matched-places/:location_id" element={<MatchedPlaces />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<Admindashboard />} />
        // In your main App.js or routing file
        <Route path="/chat/:userId/:otherUserId?" element={<WhatsAppLayout />} />
        <Route path="/interest-requests" element={<InterestRequests />} />
      </Routes>
    </Router>
  );
}

export default App;