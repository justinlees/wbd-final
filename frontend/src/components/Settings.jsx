import React from "react";
import { Form, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/Settings.css";

const Settings = () => {
  const [formData, setFormData] = useState({
    OldPassword: "",
    NewPassword: "",
    ReNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validatePassword(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          "http://localhost:5500/updatePassword",
          formData,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.status === 200) {
          setSuccessMessage("Password updated successfully.");
          navigate("/login");
        } else {
          setErrors({ submit: "Password update failed. Please try again." });
        }
      } catch (error) {
        setErrors({ submit: "An error occurred. Please try again later." });
      }
    }
  }

  function validatePassword(data) {
    const currentErrors = {};
    const passwordRegEx = /^[a-zA-Z0-9]{8,}$/;

    if (!data.OldPassword) {
      currentErrors.OldPassword = "Old password is required";
    }

    if (!passwordRegEx.test(data.NewPassword)) {
      currentErrors.NewPassword =
        "Password must be at least 8 characters long and contain only letters and numbers.";
    }

    if (data.NewPassword !== data.ReNewPassword) {
      currentErrors.ReNewPassword = "Passwords do not match.";
    }

    return currentErrors;
  }

  return (
    <div className="Settings">
      <h3>Change Your Password</h3>
      <Form className="changePasswordForm" onSubmit={handleSubmit}>
        <label>Old Password</label>
        <input
          type="password"
          className="oldPassword"
          name="OldPassword"
          placeholder="Enter Old Password"
          value={formData.OldPassword}
          onChange={handleInputChange}
        />
        {errors?.OldPassword && (
          <span className="error">{errors.OldPassword}</span>
        )}
        <label>New Password</label>
        <input
          type="password"
          className="newPassword"
          name="NewPassword"
          placeholder="Enter New Password"
          value={formData.NewPassword}
          onChange={handleInputChange}
        />
        {errors?.NewPassword && (
          <span className="error">{errors.NewPassword}</span>
        )}
        <label>ReNew Password</label>
        <input
          type="password"
          className="reNewPassword"
          name="ReNewPassword"
          placeholder="ReEnter New Password"
          value={formData.ReNewPassword}
          onChange={handleInputChange}
        />
        {errors?.ReNewPassword && (
          <span className="error">{errors.ReNewPassword}</span>
        )}

        <button className="submitButton" type="submit">
          Change Password
        </button>

        {errors?.submit && <span className="error">{errors.submit}</span>}
        {successMessage && <span className="success">{successMessage}</span>}
      </Form>
    </div>
  );
};

export default Settings;
