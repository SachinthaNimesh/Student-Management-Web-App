import React from "react";
import { useNavigate } from "react-router-dom";
import { useMoodService } from "../api/moodService";
import { getStudentDataFromBridge } from "../api/bridgingService";

const Feedback = () => {
  const navigate = useNavigate();
  const { sendMood } = useMoodService();
  const studentData = getStudentDataFromBridge();
  if (!studentData?.student_id) {
    throw new Error("Student ID is not available.");
  }
  const student_id = Number(studentData.student_id);

  // Button animation for touch/click feedback
  const handleButtonAnimation = (
    event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget as HTMLButtonElement;
    button.style.transform = "scale(0.98)";
    setTimeout(() => {
      button.style.transform = "";
    }, 100);
  };

  const handleMoodPress = async (
    emotion: "happy" | "neutral" | "sad",
    isDaily: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    handleButtonAnimation(event);
    try {
      await sendMood(student_id, emotion, isDaily);
      setTimeout(() => navigate("/checkout-greeting"), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  // Styles
  const styles = {
    page: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      minHeight: "100vh",
      minWidth: "100vw",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center", // center vertically
      padding: 20,
      color: "white",
      marginTop: 0, // remove marginTop to allow vertical centering
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      maxWidth: 400,
      marginBottom: 60,
      marginTop: 20,
    },
    greeting: {
      fontSize: 28,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    wave: {
      fontSize: 32,
      animation: "wave 2s ease-in-out infinite",
    },
    profileIcon: {
      width: 50,
      height: 50,
      background: "linear-gradient(135deg, #E8F4FD 0%, #B8E0FF 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "3px solid white",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      fontSize: 24,
      color: "#4A90E2",
    },
    moodCard: {
      background: "rgba(255,255,255,0.25)",
      backdropFilter: "blur(10px)",
      borderRadius: 20,
      padding: 30,
      width: "calc(100vw - 80px)", // 40px margin left and right
      maxWidth: 380,
      marginBottom: 30,
      boxShadow: "0 8px 32px rgba(139,126,216,0.1)",
    },
    moodTitle: {
      fontSize: 22,
      fontWeight: 600,
      color: "#2D2D2D",
      marginBottom: 25,
      textAlign: "left" as const,
    },
    moodButtons: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 15,
    },
    moodButton: {
      background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: 15,
      padding: "18px 25px",
      fontSize: 20,
      fontWeight: 600,
      color: "#4A4A6A",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 15,
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(139,126,216,0.15)",
      outline: "none",
    },
    moodEmoji: {
      width: 35,
      height: 35,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      border: "2px solid",
    },
    happy: {
      background: "linear-gradient(135deg, #FFD93D 0%, #FF8E53 100%)",
      borderColor: "#FF8E53",
      color: "white",
    },
    neutral: {
      background: "linear-gradient(135deg, #A8E6CF 0%, #4ECDC4 100%)",
      borderColor: "#4ECDC4",
      color: "white",
    },
    sad: {
      background: "linear-gradient(135deg, #FF8A9B 0%, #FF6B9D 100%)",
      borderColor: "#FF6B9D",
      color: "white",
    },
    bottomIndicator: {
      position: "fixed" as const,
      bottom: 20,
      width: 134,
      height: 5,
      background: "rgba(255,255,255,0.3)",
      borderRadius: 3,
      left: "50%",
      transform: "translateX(-50%)",
    },
  };

  // Mood emoji map
  const moodEmojis = {
    happy: "😊",
    neutral: "😐",
    sad: "😢",
  };

  return (
    <div style={styles.page}>
     

      {/* Mood Card */}
      <div style={styles.moodCard}>
        <h2 style={styles.moodTitle}>How was your day at work?</h2>
        <div style={styles.moodButtons}>
          {(["happy", "neutral", "sad"] as const).map((mood) => (
            <button
              key={mood}
              className={`mood-button ${mood}`}
              style={{
                ...styles.moodButton,
              }}
              onClick={(e) => handleMoodPress(mood, true, e)}
              onTouchStart={handleButtonAnimation}
              onTouchEnd={handleButtonAnimation}
            >
              <div
                style={{
                  ...styles.moodEmoji,
                  ...(mood === "happy"
                    ? styles.happy
                    : mood === "neutral"
                    ? styles.neutral
                    : styles.sad),
                }}
              >
                {moodEmojis[mood]}
              </div>
              {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Indicator */}
      <div style={styles.bottomIndicator}></div>

      {/* Keyframes for wave animation */}
      <style>
        {`
          @keyframes wave {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(20deg); }
            75% { transform: rotate(-10deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Feedback;
