import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomeGreeting: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/Emotions");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={handleNavigate}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Go to Emotions Page
      </button>
    </div>
  );
};

export default WelcomeGreeting;
