import { useNavigate, useLocation } from "react-router-dom";
import { useMoodService } from "../api/moodService";
import { CSSProperties } from "react";

const Feedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMood } = useMoodService();
  const student_id = location.state?.student_id || 1;

  const handleMoodPress = async (
    emotion: "happy" | "neutral" | "sad",
    isDaily: boolean
  ) => {
    try {
      await sendMood(student_id, emotion, isDaily);
      navigate("/checkout-greeting");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.question}>How was your day at work?</p>
      <button style={styles.btn} onClick={() => handleMoodPress("happy", true)}>
        <div style={styles.btnContent}>
          <img src="/assets/happy.png" alt="Happy" style={styles.image} />
          <span style={styles.text}>Happy</span>
        </div>
      </button>
      <button
        style={styles.btn}
        onClick={() => handleMoodPress("neutral", true)}
      >
        <div style={styles.btnContent}>
          <img src="/assets/neutral.png" alt="Neutral" style={styles.image} />
          <span style={styles.text}>Neutral</span>
        </div>
      </button>
      <button style={styles.btn} onClick={() => handleMoodPress("sad", true)}>
        <div style={styles.btnContent}>
          <img src="/assets/sad.png" alt="Sad" style={styles.image} />
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
