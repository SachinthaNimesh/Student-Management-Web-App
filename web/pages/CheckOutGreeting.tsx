import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckOutGreeting: React.FC = () => {
  const navigate = useNavigate();
  const [welcomeText, setWelcomeText] = useState("");

  useEffect(() => {
    const messages = [
      "Great job today! 🎉",
      "Enjoy your time off! 🌟",
      "Relax and recharge! 🌈",
      "See you next time! 👋",
      "Take care! 🌞",
      "Have a wonderful evening! 🌙",
      "Thanks for your hard work! 👍",
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setWelcomeText(randomMessage);

    const timer = setTimeout(() => {
      navigate("/"); // Updated navigation path to "/checkout"
    }, 3000); // 3 second delay

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
          {welcomeText} {/* Retained dynamic welcome text */}
        </p>
      </div>
    </div>
  );
};

export default CheckOutGreeting;
