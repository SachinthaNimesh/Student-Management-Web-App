import React from "react";
import { useNavigate } from "react-router-dom";

const CheckOutGreeting: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/Welcome");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={handleNavigate}
        className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Go to Thank You Page
      </button>
    </div>
  );
};

export default CheckOutGreeting;
