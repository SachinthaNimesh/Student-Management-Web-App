import { useState, useEffect } from "react";

const RealTimeClock = () => {
  const [currentTime, setCurrentTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentDateTime());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  function getCurrentDateTime() {
    const now = new Date();
    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    const time = now.toLocaleTimeString("en-US", options);

    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "long" }); // 'Mar'

    return `${day}${getOrdinalSuffix(day)} ${month}, ${time}`;
  }

  // Helper function to get ordinal suffix (st, nd, rd, th)
  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return "th"; // Covers 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <div>
      <span
        style={{
          color: "#888888",
          fontSize: "20px",
          fontWeight: 700,
          fontFamily: "Montserrat",
        }}
      >
        {currentTime}
      </span>
    </div>
  );
};

export default RealTimeClock;
