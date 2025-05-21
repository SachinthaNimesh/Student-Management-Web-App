import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMoodService } from "../api/moodService";
import { CSSProperties } from "react";
import happyImage from "../assets/happy.png";
import neutralImage from "../assets/neutral.png";
import sadImage from "../assets/sad.png";
import React from "react";
import { getStudentDataFromBridge } from "../api/bridgingService";

const Feedback = () => {
  const navigate = useNavigate();
  const { sendMood } = useMoodService();
  const studentData = getStudentDataFromBridge();
  if (!studentData?.student_id) {
    throw new Error("Student ID is not available.");
  }
  const student_id = Number(studentData.student_id);
  const [clickedButton, setClickedButton] = useState<string | null>(null);

  const handleButtonAnimation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
  };

  const handleMoodPress = async (
    emotion: "happy" | "neutral" | "sad",
    isDaily: boolean,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    handleButtonAnimation(event); // Apply button animation
    setClickedButton(emotion); // Set the clicked button for animation
    try {
      await sendMood(student_id, emotion, isDaily);
      setTimeout(() => navigate("/checkout-greeting"), 500); // Delay navigation to allow animation
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.question}>How was your day at work?</p>
      <button
        style={{
          ...styles.btn,
          ...(clickedButton === "happy" ? styles.btnClicked : {}),
        }}
        onClick={(event) => handleMoodPress("happy", true, event)}
      >
        <div style={styles.btnContent}>
          <img src={happyImage} alt="Happy" style={styles.image} />
          <span style={styles.text}>Happy</span>
        </div>
      </button>
      <button
        style={{
          ...styles.btn,
          ...(clickedButton === "neutral" ? styles.btnClicked : {}),
        }}
        onClick={(event) => handleMoodPress("neutral", true, event)}
      >
        <div style={styles.btnContent}>
          <img src={neutralImage} alt="Neutral" style={styles.image} />
          <span style={styles.text}>Neutral</span>
        </div>
      </button>
      <button
        style={{
          ...styles.btn,
          ...(clickedButton === "sad" ? styles.btnClicked : {}),
        }}
        onClick={(event) => handleMoodPress("sad", true, event)}
      >
        <div style={styles.btnContent}>
          <img src={sadImage} alt="Sad" style={styles.image} />
          <span style={styles.text}>Sad</span>
        </div>
      </button>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: "calc(100% - 60px)",
    borderRadius: "18px",
    textAlign: "center",
  },
  btn: {
    padding: "10px",
    margin: "10px",
    height: "83px",
    width: "90%",
    backgroundColor: "#fbff00",
    border: "1px solid rgba(0, 0, 0, 0.20)",
    borderRadius: "15px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    transition: "transform 0.3s ease", // Add smooth transition
  },
  btnClicked: {
    transform: "scale(0.95)", // Shrink effect on click
  },
  image: {
    width: "54px",
    height: "54px",
  },
  text: {
    fontSize: "30px",
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
    color: "#000",
  },
  btnContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    gap: "20px",
  },
  question: {
    color: "#000",
    fontSize: "2.8vh",
    fontFamily: "Poppins, sans-serif",
    textAlign: "center",
  },
};

export default Feedback;
