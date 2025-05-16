import React from "react";

interface CheckInProps {
  deviceId: number | null;
}

const CheckIn: React.FC<CheckInProps> = ({ deviceId }) => {
  return (
    <div>
      <h1>Check-In Screen</h1>
      <p>Device ID: {deviceId !== null ? deviceId : "Not available"}</p>
    </div>
  );
};

export default CheckIn;
