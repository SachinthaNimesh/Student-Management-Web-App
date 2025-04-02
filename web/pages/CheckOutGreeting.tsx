import React from "react";

const CheckOutGreeting: React.FC = () => {
  return (
    <div className="container">
      <h1 className="title">Thank You for Your Purchase!</h1>
      <p className="message">
        We appreciate your business. If you have any questions, please email us
        at support@example.com.
      </p>
    </div>
  );
};

export default CheckOutGreeting;

// Add the following CSS in your global styles or a CSS module
/*
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #333;
}

.message {
  font-size: 1rem;
  color: #555;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }

  .message {
    font-size: 0.9rem;
  }
}
*/
