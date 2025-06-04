import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCheckoutById } from "../api/attendanceService";
import { getStudentDataFromBridge } from "../api/bridgingService";

// Floating animation keyframes for inline style
const floatKeyframes = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg); }
  66% { transform: translateY(10px) rotate(-3deg); }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

const styles = {
  background: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -1,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    overflow: "hidden",
  },
  floating: (w: number, h: number, top?: string, left?: string, right?: string, bottom?: string, delay?: string) => ({
    position: "absolute" as const,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.1)",
    width: w,
    height: h,
    top,
    left,
    right,
    bottom,
    animation: `float 6s ease-in-out infinite${delay ? ` ${delay}` : ""}`,
    animationDelay: delay,
  }),
  mainContent: {
    flex: 1,
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "30px",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    zIndex: 1,
  },
  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    padding: 30,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.3)",
    transition: "all 0.3s ease",
    textAlign: "center" as const,
    maxWidth: 400,
    margin: "0 auto",
  },
  houseIcon: {
    fontSize: 80,
    marginBottom: 20,
    animation: "bounce 2s ease-in-out infinite",
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#2c3e50",
    marginBottom: 20,
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  btn: {
    width: "100%",
    padding: 18,
    border: "none",
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(45deg, #48c6ef, #6f86d6)",
    color: "white",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    transition: "all 0.3s ease",
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
  },
  btnDisabled: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "4px solid rgba(0, 0, 0, 0.2)",
    borderTop: "4px solid #000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

const CheckOutScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleButtonAnimation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
  };

  const handleCheckOut = async (event: React.MouseEvent<HTMLButtonElement>) => {
    handleButtonAnimation(event);
    try {
      setLoading(true);

      const studentData = await getStudentDataFromBridge();
      if (!studentData || !studentData.student_id) {
        alert("Student data is not available. Please try again.");
        return;
      }

      if (
        typeof studentData.latitude !== "number" ||
        typeof studentData.longitude !== "number"
      ) {
        alert("Location data is not available. Please try again.");
        return;
      }

      const latitude = studentData.latitude;
      const longitude = studentData.longitude;
      const studentId = Number(studentData.student_id);

      await postCheckoutById(studentId, latitude, longitude);
      navigate("/feedback");
    } catch (error) {
      alert("An error occurred during check-out: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100vw", overflowX: "hidden" }}>
      {/* Floating background animation */}
      <style>{floatKeyframes}</style>
      <div style={styles.background}>
        <div style={styles.floating(80, 80, "20%", "10%", undefined, undefined, "0s")}></div>
        <div style={styles.floating(60, 60, "60%", undefined, "15%", undefined, "2s")}></div>
        <div style={styles.floating(100, 100, undefined, "20%", undefined, "30%", "4s")}></div>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.card}>
          <div style={styles.houseIcon}>🏠</div>
          <h2 style={styles.title}>Ready to Leave?</h2>
          <button
            style={{
              ...styles.btn,
              ...(loading ? styles.btnDisabled : {}),
            }}
            onClick={handleCheckOut}
            disabled={loading}
          >
            {loading ? (
              <div style={styles.spinner}></div>
            ) : (
              <>
                <span style={{ fontSize: 24, marginRight: 10 }}>👋</span>
                <span>Check Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOutScreen;
