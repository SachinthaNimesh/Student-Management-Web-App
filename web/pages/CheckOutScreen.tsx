import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postCheckoutById } from "../api/attendanceService";
import checkoutImage from "../assets/checkout.png";

const styles = {
  flexBox: {
    padding: "10px",
    paddingTop: "25px",
    paddingBottom: "25px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: "calc(100% - 60px)",
    maxWidth: "600px",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "20px",
    margin: "0 auto",
  },
  image: {
    width: "93.66px",
    height: "93.65px",
  },
  btn: {
    padding: "10px",
    margin: "10px",
    height: "82px",
    width: "263px",
    backgroundColor: "#fbff00",
    border: "1px solid rgba(0, 0, 0, 0.2)",
    borderRadius: "15px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  btnDisabled: {
    cursor: "not-allowed",
    opacity: 0.6,
  },
  text: {
    fontSize: "25px",
    color: "#000",
    marginBottom: "10px",
    textAlign: "center" as const,
    fontFamily: "Poppins, sans-serif",
    fontWeight: "bold",
  },
  spinner: {
    width: "24px",
    height: "24px",
    border: "4px solid rgba(0, 0, 0, 0.2)",
    borderTop: "4px solid #000",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
};

const CheckOutScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckOut = async () => {
    try {
      setLoading(true);

      // Request location permissions and get the current location
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Send check-out data to the backend
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
    <div style={styles.flexBox}>
      <img src={checkoutImage} alt="Checkout" style={styles.image} />
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
          <span style={styles.text}>Checkout</span>
        )}
      </button>
    </div>
  );
};

export default CheckOutScreen;
