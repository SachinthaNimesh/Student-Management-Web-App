import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postCheckinById } from "../api/attendanceService";
import * as Geocode from "react-geocode"; // Import react-geocode
import React from "react";

const CheckInScreen = () => {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    time: "",
    period: "",
    day: "",
    month: "",
  });
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const navigate = useNavigate();

  // Set the API key for react-geocode
  const googleGeoApiKey = import.meta.env.VITE_GOOGLE_GEO_API_KEY || ""; // Use Vite's import.meta.env
  if (!googleGeoApiKey) {
    console.error(
      "Google Geo API Key is not defined. Please set it in your environment configuration."
    );
  }
  Geocode.setKey(googleGeoApiKey);
  Geocode.setLanguage("en");
  Geocode.setRegion("us");

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

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          console.log("Latitude:", latitude, "Longitude:", longitude); // Log latitude and longitude

          try {
            // Use react-geocode to fetch the address
            const response = await Geocode.fromLatLng(latitude, longitude);
            const address = response.results[0].formatted_address;
            setUserLocation(address);
          } catch (error) {
            console.error("Error occurred while fetching address:", error);
            setUserLocation(
              "Error fetching address. Please ensure the API key is valid and try again."
            );
          }
        },
        (error) => {
          console.error(
            "Error occurred while fetching geolocation:",
            error.code,
            error.message
          );
          setUserLocation("Unable to fetch location");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
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

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          console.log("Latitude:", latitude, "Longitude:", longitude); // Log latitude and longitude

          try {
            const studentId = 1; // Replace this with actual logic to fetch student ID
            await postCheckinById(studentId, latitude, longitude, true);
            navigate("/welcome-greeting");
          } catch (error) {
            console.error(
              "Error occurred while sending check-in data to the backend:",
              error
            );
            alert("An error occurred during check-in. Please try again.");
          }
        },
        (error) => {
          console.error(
            "Error occurred while fetching geolocation during check-in:",
            error.code,
            error.message
          );
          alert("Unable to fetch location. Please try again.");
        }
      );
    } catch (error) {
      console.error("An unexpected error occurred during check-in:", error);
      alert("An error occurred during check-in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonAnimation = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = event.currentTarget;
    button.style.transform = "scale(0.95)";
    setTimeout(() => {
      button.style.transform = "scale(1)";
    }, 150);
  };

  return (
    <div style={styles.checkInFrame}>
      <h1 style={styles.checkInText}>Check-in</h1>
      <p style={{ ...styles.infoText, marginTop: "-60px" }}>
        🕑 {currentDateTime.time} {currentDateTime.period}
      </p>
      <p style={styles.infoText}>
        📆 {currentDateTime.day} {currentDateTime.month}
      </p>
      <p style={styles.infoText}>📍 {userLocation || "Fetching location..."}</p>

      <button
        style={styles.btn}
        onClick={(event) => {
          handleButtonAnimation(event);
          handleCheckIn();
        }}
        disabled={loading}
      >
        {loading ? (
          <span>Loading...</span>
        ) : (
          <span style={styles.btnText}>Check in</span>
        )}
      </button>
    </div>
  );
};

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
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
    marginTop: "-32vh",
    color: "#000",
    fontWeight: "600",
    position: "fixed" as const,
  },
  infoText: {
    marginLeft: "2vh", // Align horizontally closer to checkInText
    fontSize: "26px", // Reduced font size
    color: "#000",
    marginBottom: "-15px",
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
    outline: "none",
    marginTop: "360px",
    position: "fixed",
  },
  btnText: {
    fontSize: "27px",
    color: "#000",
    fontWeight: "bold",
  },
};

export default CheckInScreen;
