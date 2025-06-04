import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomeGreeting: React.FC = () => {
  const navigate = useNavigate();
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
    const messages = [
      "Let’s do this! 💪",
      "Good morning! 😊",
      "We can do it! 👍",
      "Stay happy! 🌈",
      "You are great! 🌟",
      "Today will be good! 😊",
      "Keep smiling! 😄",
      "Be your best! 🌞",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer = setTimeout(() => {
      navigate("/emotions");
    }, 2000); // 3 second delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col h-screen">
      <div
        style={{
          padding: "15px",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          width: "calc(100% - 60px)",
          paddingTop: "30px",
          paddingBottom: "45px",
          borderRadius: "18px",
          margin: "auto",
        }}
      >
        <p
          style={{
            color: "#000",
            fontSize: "48px",
            fontFamily: "'Poppins', sans-serif",
            textAlign: "center",
          }}
        >
          {welcomeText}
        </p>
      </div>
    </div>
  );
};

export default WelcomeGreeting;
