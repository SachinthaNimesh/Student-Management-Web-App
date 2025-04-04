import { Paper } from "@mui/material";
import Header from "../components/Header"; // Import Header properly
import CheckInScreen from "../pages/CheckInScreen"; // Import CheckInScreen
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomeGreeting from "../pages/WelcomeGreeting"; // Import WelcomeGreeting
import Emotion from "../pages/Emotion"; // Import Emotion
import CheckOutScreen from "../pages/CheckOutScreen"; // Import CheckOutScreen
import Welcome from "../pages/Welcome"; // Import Welcome
import Feedback from "../pages/Feedback"; // Import Feedback
import CheckOutGreeting from "../pages/CheckOutGreeting"; // Import CheckOutGreeting
import BackgroundImage from "../assets/bg2.jpg"; // Import background image
function PaperWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "90vw", // Responsive width
          maxWidth: "414px", // Max width for larger phones
          height: "90vh", // Responsive height
          maxHeight: "896px", // Max height for larger phones
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {children}
      </Paper>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/checkin"
          element={
            <PaperWrapper>
              <Header />
              <CheckInScreen />
            </PaperWrapper>
          }
        />
        <Route
          path="/welcome-greeting"
          element={
            <PaperWrapper>
              <Header />
              <WelcomeGreeting />
            </PaperWrapper>
          }
        />
        <Route
          path="/emotions"
          element={
            <PaperWrapper>
              <Header />
              <Emotion />
            </PaperWrapper>
          }
        />
        <Route
          path="/checkout"
          element={
            <PaperWrapper>
              <Header />
              <CheckOutScreen />
            </PaperWrapper>
          }
        />
        <Route
          path="/feedback"
          element={
            <PaperWrapper>
              <Header />
              <Feedback />
            </PaperWrapper>
          }
        />
        <Route
          path="/checkout-greeting"
          element={
            <PaperWrapper>
              <Header />
              <CheckOutGreeting />
            </PaperWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
