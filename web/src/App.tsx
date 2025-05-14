import { Paper } from "@mui/material";
import Header from "../components/Header";
import CheckInScreen from "../pages/CheckInScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomeGreeting from "../pages/WelcomeGreeting";
import Emotion from "../pages/Emotion";
import CheckOutScreen from "../pages/CheckOutScreen";
import Welcome from "../pages/Welcome";
import Feedback from "../pages/Feedback";
import CheckOutGreeting from "../pages/CheckOutGreeting";
import BackgroundImage from "../assets/bg2.jpg";
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
          flex: 1,
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw", // Full width of the screen
          height: "100vh", // Full height of the screen
          position: "absolute",
          top: "0", // Align to the top
          left: "0", // Align to the left
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
