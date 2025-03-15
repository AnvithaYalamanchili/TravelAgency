import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import VerifyFacePage from "./VerifyFacePage";
import Dashboard from "./Dashboard"; 
import HomePage from "./HomePage";
import TravelPreferences from "./TravelPreferences";
import TripPage from "./TripPage";
import MatchedUsers from "./MatchedUsers"; // Import Matched Users Page
// import AdminRegisterPage from "./AdminRegister";
import AdminLoginPage from "./AdminLogin";
import Admindashboard from "./admindashboard";
import Locations from "./Locations";
import MatchedPlaces from "./MatchedPlaces";


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
        <Route path="/travel-preferences" element={<TravelPreferences />} />  {/* Travel Preferences Page */}
        <Route path="/trip/:destination" element={<TripPage/>} />
        <Route path="/matched-users" element={<MatchedUsers />} /> {/* Matched Users Page */}
        {/* <Route path="/admin-register" element={<AdminRegisterPage/>}/> */}
        <Route path="/Locations" element={<Locations/>}/>
        <Route path="/MatchedPlaces/:location_id" element={<MatchedPlaces />} />
        <Route path="/admin-login" element={<AdminLoginPage/>}/>
        <Route path="/admin-dashboard" element={<Admindashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
