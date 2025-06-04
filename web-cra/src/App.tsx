import Header from "../src/components/Header";
import CheckInScreen from "../src/pages/CheckInScreen";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import WelcomeGreeting from "../src/pages/WelcomeGreeting";
import Emotion from "../src/pages/Emotion";
import CheckOutScreen from "../src/pages/CheckOutScreen";
import Welcome from "../src/pages/Welcome";
import Feedback from "../src/pages/Feedback";
import CheckOutGreeting from "../src/pages/CheckOutGreeting";
function PaperWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* Animated Gradient Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            top: "20%",
            left: "10%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            animation: "float 6s ease-in-out infinite",
            animationDelay: "0s",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 60,
            height: 60,
            top: "60%",
            right: "15%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            animation: "float 6s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            bottom: "30%",
            left: "20%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            animation: "float 6s ease-in-out infinite",
            animationDelay: "4s",
          }}
        />
        {/* Keyframes for floating animation */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              33% { transform: translateY(-20px) rotate(5deg); }
              66% { transform: translateY(10px) rotate(-3deg); }
            }
          `}
        </style>
      </div>
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
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
