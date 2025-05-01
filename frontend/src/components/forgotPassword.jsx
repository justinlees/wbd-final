import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/forgotPassword.css"; // Import the CSS file

const ForgotPassword = () => {
  const [Email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URI}/forgot-password`, {
        Email,
      });
      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (error) {
      setMessage("Error sending OTP.");
      console.error(error);
    }
  };

  const validateOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URI}/validate-code`, {
        Email,
        code: otp.toString(),
      });
      setStep(3);
      setMessage("OTP verified. Please set a new password.");
    } catch (error) {
      setMessage("Invalid or expired OTP.");
      console.error(error);
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URI}/reset-password`, {
        Email,
        newPassword,
      });
      setStep(4);
      setMessage("Password reset successfully.");
    } catch (error) {
      setMessage("Error resetting password.");
      console.error(error);
    }
  };

  return (
    <div className="ForgotPasswordPage">
      <div className="formBlock">
        <h2>Forgot Password</h2>
        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={sendOtp}>Send OTP</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="bold">Email: {Email}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={validateOtp}>Validate OTP</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <p className="bold">Email: {Email}</p>
            <p className="bold">OTP Verified Successfully</p>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              pattern="^[a-zA-Z0-9]{8,}$"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={resetPassword}>Reset Password</button>
          </div>
        )}
        {step === 4 && (
          <div>
            <h3>Password Reset Successfully!</h3>
            <Link to="/login">Login Again</Link>
          </div>
        )}
        <p className="bold">{message}</p>
      </div>
    </div>
  );
};

export default ForgotPassword;
