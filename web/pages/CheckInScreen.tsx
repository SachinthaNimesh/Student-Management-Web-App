import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postCheckinById } from "../api/attendanceService";
import { getStudentDataFromBridge } from "../api/bridgingService";
import Welcome from "./Welcome"; // Import Welcome screen

// Extracted minimal CSS-in-JS for the design
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
  }),
  card: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: 25,
    padding: 30,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    maxWidth: 400,
    width: "calc(100vw - 80px)", // 40px margin on both sides
    margin: "60px 40px 0 40px",
    transition: "all 0.3s ease",
    textAlign: "center" as const,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 20,
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    alignItem: "flex-start",
  },
  locationInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 15,
    marginBottom: 30,
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 12,
    background: "rgba(102, 126, 234, 0.1)",
    borderRadius: 15,
  },
  icon: { fontSize: 20 },
  infoText: { fontSize: 18, fontWeight: 500, color: "#2c3e50" },
  checkinButton: {
    width: "100%",
    padding: 18,
    border: "none",
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(45deg, #ff6b6b, #feca57)",
    color: "white",
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    transition: "all 0.3s ease",
  },
};

const CheckInScreen = () => {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    time: "",
    period: "",
    day: "",
    month: "",
    fullDate: "",
  });

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [showWelcome, setShowWelcome] = useState(true); // Add state for welcome screen
  const navigate = useNavigate();

  useEffect(() => {
    // Show Welcome screen for 2 seconds, then show check-in
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showWelcome) return;
    const updateDateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12; // Convert to 12-hour format
      const day = now.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const month = monthNames[now.getMonth()];
      const fullDate = `${month} ${day}, ${now.getFullYear()}`;
      setCurrentDateTime({
        time: `${hours}:${minutes}`,
        period,
        day: day.toString(),
        month,
        fullDate,
      });
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    // Update lat/lng from bridge every second (or as needed)
    const updateLatLng = async () => {
      const studentData = await getStudentDataFromBridge();
      if (
        studentData &&
        typeof studentData.latitude === "number" &&
        typeof studentData.longitude === "number"
      ) {
        setLatitude(studentData.latitude);
        setLongitude(studentData.longitude);
      }
    };
    updateLatLng();
    const latLngInterval = setInterval(updateLatLng, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(latLngInterval);
    };
  }, [showWelcome]);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const studentData = await getStudentDataFromBridge();
      if (!studentData || !studentData.student_id) {
        alert("Student data is not available. Please try again.");
        setLoading(false);
        return;
      }
      const student_id = Number(studentData.student_id);

      // Use lat/lng from state
      if (
        latitude === null ||
        longitude === null
      ) {
        alert("Location data is not available. Please try again.");
        setLoading(false);
        return;
      }

      await postCheckinById(student_id, latitude, longitude, true);
      navigate("/welcome-greeting");
    } catch (error) {
      console.error("An error occurred during check-in:", error);
      alert("An error occurred during check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    // Add a wrapper div with high z-index to ensure Welcome is always on top
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
        <Welcome />
      </div>
    );
  }

  return (
    <div>
      {/* Background animation */}
      <div style={styles.background}>
        <div style={styles.floating(80, 80, "20%", "10%")}></div>
        <div style={styles.floating(60, 60, "60%", undefined, "15%")}></div>
        <div style={styles.floating(100, 100, undefined, "20%", undefined, "30%")}></div>
      </div>
      {/* Main Card */}
      <div
        style={styles.card}
        // Prevent width change on button press by not letting button affect card width
      >
        <h2 style={styles.title}>Check In</h2>
        <div style={styles.locationInfo}>
          <div style={styles.infoRow}>
            <span style={styles.icon}>🕐</span>
            <span style={styles.infoText}>
              {currentDateTime.time} {currentDateTime.period}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.icon}>📅</span>
            <span style={styles.infoText}>{currentDateTime.fullDate}</span>
          </div>
        </div>
        <button
          style={styles.checkinButton}
          onClick={handleCheckIn}
          disabled={loading}
        >
          {loading ? "Loading..." : "✨ Check In Now ✨"}
        </button>
      </div>
    </div>
  );
};

export default CheckInScreen;
