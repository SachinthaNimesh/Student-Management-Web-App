import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postCheckinById } from "../api/attendanceService";
import React from "react";
// import { fetchLocationFromAPI } from "../api/locationService";
import { GOOGLE_API_KEY } from "../config/config";
import { CSSProperties } from "react";
import axios from "axios";

const CheckInScreen = () => {
  const [loading, setLoading] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState({
    time: "",
    period: "",
    day: "",
    month: "",
  });
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      if (!GOOGLE_API_KEY) {
        throw new Error(
          "Please provide a valid Google API key in your .env file"
        );
      }

      interface GeocodeResponse {
        status: string;
        results: { formatted_address: string }[];
      }

      const response = await axios.get<GeocodeResponse>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );

      if (response.data.status === "OK" && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        throw new Error(`Geocoding API error: ${response.data.status}`);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return "Address lookup failed";
    }
  };

  useEffect(() => {
    const getDeviceLocation = async () => {
      try {
        if (!navigator.geolocation) {
          console.error("Geolocation is not supported by this browser.");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const address = await reverseGeocode(latitude, longitude);
            console.log(address);

            setLatitude(latitude);
            setLongitude(longitude);
            setUserLocation(address || `Lat: ${latitude}, Lng: ${longitude}`);
          },
          (error) => {
            console.error("Error getting location: ", error);
            setUserLocation("Failed to fetch location");
          },
          { enableHighAccuracy: true }
        );
      } catch (error) {
        console.error("Error getting location: ", error);
        setUserLocation("Failed to fetch location");
      }
    };

    getDeviceLocation();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
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

    updateDateTime();
  }, []);
    // const fetchLocation = async () => {
    //   try {
    //     const locationData = await fetchLocationFromAPI(); // Call the API
    //     const { latitude, longitude, address } = locationData;
    //     setLatitude(latitude);
    //     setLongitude(longitude);
    //     setUserLocation(address || `Lat: ${latitude}, Lng: ${longitude}`);
    //   } catch (error) {
    //     console.error("Failed to fetch location:", error);
    //     setUserLocation("Failed to fetch location");
    //   }
    // };

    // fetchLocation();

    // Listen for location updates from the React Native app
    // const handleLocationMessage = (event: MessageEvent) => {
    //   if (event.data && event.data.type === "LOCATION_UPDATE") {
    //     const { latitude, longitude, address } = event.data.payload;
    //     console.log(
    //       "Received location from native app:",
    //       latitude,
    //       longitude,
    //       address
    //     );
    //     setLatitude(latitude);
    //     setLongitude(longitude);
    //     setUserLocation(address || `Lat: ${latitude}, Lng: ${longitude}`);
    //   }
    // };

    // window.addEventListener("message", handleLocationMessage);


  const handleCheckIn = async () => {
    try {
      setLoading(true);

      const studentId = 1; // Replace this with actual logic to fetch student ID
      if (!userLocation || !latitude || !longitude) {
        alert("Location is not available. Please try again.");
        return;
      }

      await postCheckinById(studentId, latitude, longitude, true);
      navigate("/welcome-greeting");
    } catch (error) {
      console.error("An error occurred during check-in:", error);
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
      <p style={styles.infoText}>
        📍 {userLocation || "Waiting for location..."}
      </p>
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

const styles: { [key: string]: CSSProperties } = {
  checkInFrame: {
    width: "calc(100% - 60px)",
    maxWidth: "400px",
    height: "58vh",
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
    marginTop: "-40vh",
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
    marginBottom: "5vh",
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
