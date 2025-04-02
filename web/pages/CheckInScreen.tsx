import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { postCheckinById } from "../api/attendanceService";

const CheckInScreen = () => {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    time: "",
    period: "",
    day: "",
    month: "",
  });
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const updateDateTime = () => {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours ? hours : 12;

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
    setCurrentDateTime({
      time: `${hours}:${minutes}`,
      period,
      day: day.toString(),
      month,
    });
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(
            `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
          );
        },
        (error) => {
          console.error("Error fetching location:", error);
          setUserLocation("Unable to fetch location");
        }
      );
    } else {
      setUserLocation("Geolocation not supported");
    }
  };

  useEffect(() => {
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    fetchLocation();
    return () => clearInterval(intervalId);
  }, []);

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      // Request location permissions
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Replace hardcoded student ID with dynamic logic
          const studentId = 1; // Replace this with actual logic to fetch student ID

          // Send check-in data to the backend
          await postCheckinById(studentId, latitude, longitude, true);

          // Navigate to the "Welcome" page
          navigate("/welcome-greeting"); // Use navigate instead of navigation.navigate
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch location. Please try again.");
        }
      );
    } catch (error) {
      console.error("An error occurred during check-in:", error);
      alert("An error occurred during check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.checkInFrame}>
      <h1 style={styles.checkInText}>Check-in</h1>
      <p style={styles.infoText}>
        🕑 {currentDateTime.time} {currentDateTime.period}
      </p>
      <p style={styles.infoText}>
        📆 {currentDateTime.day} {currentDateTime.month}
      </p>
      <p style={styles.infoText}>📍 {userLocation || "Fetching location..."}</p>

      <button style={styles.btn} onClick={handleCheckIn} disabled={loading}>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <span style={styles.btnText}>Check in</span>
        )}
      </button>
    </div>
  );
};

const styles = {
  checkInFrame: {
    width: "calc(100% - 60px)",
    maxWidth: "400px",
    height: "460px",
    borderRadius: "18px",
    backgroundColor: "rgba(225, 225, 225, 0.4)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "20px",
    margin: "0 auto",
    backdropFilter: "blur(2px)",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  checkInText: {
    fontSize: "4.5vh",
    marginLeft: "2vh",
    marginTop: "2vh",
    color: "#000",
    fontWeight: "600",
  },
  infoText: {
    marginLeft: "20px",
    fontSize: "26px",
    color: "#000",
    marginBottom: "10px",
    fontWeight: "600",
  },
  btn: {
    padding: "10px",
    backgroundColor: "#FBFF00",
    width: "263px",
    height: "82px",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4vh",
    borderRadius: "15px",
    border: "1px solid rgba(0, 0, 0, 0.20)",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    cursor: "pointer",
  },
  btnText: {
    fontSize: "27px",
    color: "#000",
    fontWeight: "bold",
  },
};

export default CheckInScreen;
