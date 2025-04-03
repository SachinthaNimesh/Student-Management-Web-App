import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMoodService } from "../api/moodService";
import { postCheckoutById } from "../api/attendanceService";
import { CSSProperties } from "react";

const Emotion = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMood } = useMoodService();
  const student_id = location.state?.student_id || 1;

  const handleMoodPress = async (emotion: string, isDaily: boolean) => {
    try {
      await sendMood(student_id, emotion, isDaily);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const studentId = 1; // hardcoded student id
          await postCheckoutById(studentId, latitude, longitude);
          navigate("/feedback");
        },
        () => {
          alert("Unable to retrieve your location");
        }
      );
    } catch (error) {
      alert("An error occurred during check-out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          width: "calc(100% - 60px)",
          borderRadius: "18px",
          textAlign: "center",
        }}
      >
        <p style={styles.question} onClick={() => navigate("/checkout")}>
          How are you feeling Now?
        </p>
        <button
          style={styles.btn}
          onClick={() => handleMoodPress("happy", false)}
        >
          <div style={styles.btnContent}>
            <img
              src="/public/happy.png"
              alt="Happy"
              style={{
                width: "54px",
                height: "54px",
              }}
            />
            <span style={styles.text}>Happy</span>
          </div>
        </button>
        <button
          style={styles.btn}
          onClick={() => handleMoodPress("neutral", false)}
        >
          <div style={styles.btnContent}>
            <img
              src="/public/neutral.png"
              alt="Neutral"
              style={{
                width: "54px",
                height: "54px",
              }}
            />
            <span style={styles.text}>Neutral</span>
          </div>
        </button>
        <button
          style={styles.btn}
          onClick={() => handleMoodPress("sad", false)}
        >
          <div style={styles.btnContent}>
            <img
              src="/public/sad.png"
              alt="Sad"
              style={{
                width: "54px",
                height: "54px",
              }}
            />
            <span style={styles.text}>Sad</span>
          </div>
        </button>
      </div>
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          width: "calc(100% - 60px)",
          height: "100px",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          justifyContent: "center",
          gap: "25px",
        }}
      >
        <img src="/public/checkout.png" alt="Checkout" style={styles.image} />
        <button
          style={{
            padding: "13.31px 26.62px",
            backgroundColor: "#fbff00",
            borderRadius: "13.31px",
            border: "1px solid rgba(0, 0, 0, .2)",
            boxShadow: "0px 4px 4px rgba(146, 23, 23, 0.25)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleCheckOut}
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span
              style={
                {
                  fontSize: "18.63px",
                  color: "#000",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                } as CSSProperties
              }
            >
              Early Checkout
            </span>
          )}
        </button>
      </div>
    </>
  );
};

// Define styles with proper TypeScript typing
const styles: Record<string, CSSProperties> = {
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
    width: "55px",
    height: "60px",
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

export default Emotion;
