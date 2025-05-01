import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        background:
          "linear-gradient(135deg, #f89fa3, #f3c3e0 30%, #c0e1f8 60%, #91e0d5)",
        color: "#333",
        fontFamily: "Arial, sans-serif",
        width: "100vw",
      }}
    >
      <h1 style={{ fontSize: "96px", margin: "0" }}>404</h1>
      <p style={{ fontSize: "24px", margin: "16px 0" }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#007BFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onClick={handleGoBack}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage;
