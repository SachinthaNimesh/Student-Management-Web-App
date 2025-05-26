import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMoodService } from "../api/moodService";
import { postCheckoutById } from "../api/attendanceService";
import { getStudentDataFromBridge } from "../api/bridgingService";

const popupContent: Record<
  string,
  { emoji: string; title: string; message: string; strategies?: { icon: string; title: string; desc: string }[]; buttons: { label: string; type: "primary" | "secondary" }[] }
> = {
  happy: {
    emoji: "🌟",
    title: "That's Wonderful!",
    message: "It's great to see you feeling happy today! Your positive energy can make a real difference.",
    buttons: [{ label: "Keep Shining!", type: "primary" }],
  },
  neutral: {
    emoji: "🌱",
    title: "It's Okay to Feel Neutral",
    message: "Sometimes we need quiet moments. Here are some gentle ways to lift your spirits:",
    strategies: [
      { icon: "🎵", title: "Listen to Music", desc: "Put on your favorite uplifting playlist" },
      { icon: "🚶‍♀️", title: "Take a Walk", desc: "Fresh air and movement can boost your mood" },
      { icon: "📞", title: "Connect with Someone", desc: "Reach out to a friend or family member" },
    ],
    buttons: [
      { label: "I'll Try These", type: "primary" },
      { label: "Maybe Later", type: "secondary" },
    ],
  },
  sad: {
    emoji: "🤗",
    title: "It's Okay to Feel Sad",
    message: "Your feelings are valid. Here are some caring ways to support yourself:",
    strategies: [
      { icon: "🫖", title: "Make a Warm Drink", desc: "Tea, coffee, or hot chocolate can be comforting" },
      { icon: "📝", title: "Write it Down", desc: "Journaling can help process your feelings" },
      { icon: "🛁", title: "Self-Care Moment", desc: "Take a warm bath or do something nurturing" },
      { icon: "💙", title: "Seek Support", desc: "Don't hesitate to talk to someone you trust" },
    ],
    buttons: [
      { label: "Thank You", type: "primary" },
      { label: "Not Now", type: "secondary" },
    ],
  },
};

const Emotion = () => {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState<null | "happy" | "neutral" | "sad">(null);
  const navigate = useNavigate();
  const { sendMood } = useMoodService();
  const studentData = getStudentDataFromBridge();

  if (!studentData?.student_id) {
    throw new Error("Student ID is not available.");
  }

  const student_id = Number(studentData.student_id);

  const handleMoodPress = async (emotion: "happy" | "neutral" | "sad", isDaily: boolean) => {
    try {
      await sendMood(student_id, emotion, isDaily);
      setPopup(emotion);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const studentData = await getStudentDataFromBridge();
      let latitude = 0;
      let longitude = 0;
      if (studentData && typeof studentData.latitude === "number" && typeof studentData.longitude === "number") {
        latitude = studentData.latitude;
        longitude = studentData.longitude;
      }
      await postCheckoutById(student_id, latitude, longitude);
      navigate("/feedback");
    } catch (error) {
      alert("An error occurred during check-out: " + error);
    } finally {
      setLoading(false);
    }
  };

  // Button animation for touch/click feedback
  const handleButtonAnimation = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const button = event.currentTarget as HTMLButtonElement;
    button.style.transform = "scale(0.98)";
    setTimeout(() => {
      button.style.transform = "";
    }, 100);
  };

  // Popup close handler
  const closePopup = () => setPopup(null);

  // Styles
  const styles = {
    page: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "linear-gradient(135deg, #8B7ED8 0%, #9F8FE8 50%, #A294EA 100%)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      padding: 20,
      color: "white",
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
      width: "100%",
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
    checkoutCard: {
      background: "rgba(255,255,255,0.25)",
      backdropFilter: "blur(10px)",
      borderRadius: 20,
      padding: 20,
      width: "100%",
      maxWidth: 380,
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    },
    checkoutButton: {
      background: "linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%)",
      border: "2px solid rgba(255,255,255,0.3)",
      borderRadius: 15,
      padding: "18px 25px",
      fontSize: 18,
      fontWeight: 600,
      color: "#4A4A6A",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 15,
      width: "100%",
      transition: "all 0.3s ease",
      boxShadow: "0 8px 25px rgba(139,126,216,0.15)",
      outline: "none",
    },
    homeIcon: {
      fontSize: 24,
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
    popupOverlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: popup ? "flex" : "none",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      opacity: popup ? 1 : 0,
      visibility: popup ? "visible" : "hidden",
      transition: "all 0.3s ease",
    },
    popup: {
      background: "white",
      borderRadius: 20,
      padding: 30,
      maxWidth: 320,
      width: "90%",
      textAlign: "center" as const,
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      transform: popup ? "scale(1)" : "scale(0.8)",
      transition: "all 0.3s ease",
      color: "#4A4A6A",
    },
    popupEmoji: {
      fontSize: 60,
      marginBottom: 20,
      display: "block",
    },
    popupTitle: {
      fontSize: 24,
      fontWeight: 700,
      marginBottom: 15,
    },
    popupMsg: {
      color: "#6B6B6B",
      fontSize: 16,
      lineHeight: 1.5,
      marginBottom: 25,
    },
    popupButtons: {
      display: "flex",
      gap: 15,
      justifyContent: "center",
      marginTop: 10,
    },
    popupBtn: {
      padding: "12px 25px",
      borderRadius: 25,
      border: "none",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontSize: 14,
    },
    popupBtnPrimary: {
      background: "linear-gradient(135deg, #8B7ED8 0%, #9F8FE8 100%)",
      color: "white",
    },
    popupBtnSecondary: {
      background: "#F5F5F5",
      color: "#6B6B6B",
    },
    copingStrategies: {
      textAlign: "left" as const,
      marginTop: 20,
    },
    copingTitle: {
      color: "#4A4A6A",
      fontSize: 18,
      marginBottom: 15,
      textAlign: "center" as const,
    },
    strategyItem: {
      background: "#F8F9FF",
      borderRadius: 12,
      padding: 15,
      marginBottom: 12,
      borderLeft: "4px solid #8B7ED8",
    },
    strategyItemTitle: {
      color: "#8B7ED8",
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 5,
    },
    strategyItemDesc: {
      color: "#6B6B6B",
      fontSize: 13,
      margin: 0,
      lineHeight: 1.4,
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
        <h2 style={styles.moodTitle}>How are you feeling Now?</h2>
        <div style={styles.moodButtons}>
          {(["happy", "neutral", "sad"] as const).map((mood) => (
            <button
              key={mood}
              className={`mood-button ${mood}`}
              style={{
                ...styles.moodButton,
                ...(popup === mood ? { background: "linear-gradient(135deg, #E8E6FF 0%, #D4D1FF 100%)", borderColor: "rgba(139, 126, 216, 0.6)", transform: "scale(0.98)" } : {}),
              }}
              onClick={(e) => {
                handleButtonAnimation(e);
                handleMoodPress(mood, false);
              }}
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

      {/* Checkout Card */}
      <div style={styles.checkoutCard}>
        <button
          style={styles.checkoutButton}
          onClick={(e) => {
            handleButtonAnimation(e);
            handleCheckOut();
          }}
          onTouchStart={handleButtonAnimation}
          onTouchEnd={handleButtonAnimation}
          disabled={loading}
        >
          <span style={styles.homeIcon}>🏠</span>
          {loading ? "Loading..." : "Early Checkout"}
        </button>
      </div>

      {/* Bottom Indicator */}
      <div style={styles.bottomIndicator}></div>

      {/* Popup Overlay */}
      {popup && (
        <div
          style={styles.popupOverlay as React.CSSProperties}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePopup();
          }}
        >
          <div style={styles.popup}>
            <span style={styles.popupEmoji}>{popupContent[popup].emoji}</span>
            <h3 style={styles.popupTitle}>{popupContent[popup].title}</h3>
            <p style={styles.popupMsg}>{popupContent[popup].message}</p>
            {popupContent[popup].strategies && (
              <div style={styles.copingStrategies}>
                {popupContent[popup].strategies!.map((s, i) => (
                  <div key={i} style={styles.strategyItem}>
                    <h5 style={styles.strategyItemTitle}>
                      {s.icon} {s.title}
                    </h5>
                    <p style={styles.strategyItemDesc}>{s.desc}</p>
                  </div>
                ))}
              </div>
            )}
            <div style={styles.popupButtons}>
              {popupContent[popup].buttons.map((btn, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.popupBtn,
                    ...(btn.type === "primary"
                      ? styles.popupBtnPrimary
                      : styles.popupBtnSecondary),
                  }}
                  onClick={closePopup}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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

export default Emotion;
