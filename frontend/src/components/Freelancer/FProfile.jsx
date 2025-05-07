import React, { useState } from "react";
import { useOutletContext, Form, redirect } from "react-router-dom";
import axios from "axios";

export default function FProfile() {
  const freelancerData = useOutletContext();
  const [showPopUp, setShowPopUp] = useState(false);

  const [formData, setFormData] = useState({
    FirstName: freelancerData.FirstName || "",
    LastName: freelancerData.LastName || "",
    DOB: new Date(freelancerData.DOB).toISOString().split("T")[0],
    Email: freelancerData.Email || "",
    MobileNo: freelancerData.MobileNo || "",
    UserName: freelancerData.UserName || "",
    Skill: freelancerData.Skill || "",
    workedAt: freelancerData.bio?.workedAt || "",
    experience: freelancerData.bio?.experience || "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const currentErrors = {};
    const nameRegEx = /^[a-zA-Z]+$/;
    const mobileNoRegEx = /^[0-9]{10}$/;

    if (!nameRegEx.test(formData.FirstName)) {
      currentErrors.FirstName = "Enter a valid first name";
    }
    if (!nameRegEx.test(formData.LastName)) {
      currentErrors.LastName = "Enter a valid last name";
    }
    const dobDate = new Date(formData.DOB);
    const today = new Date();
    if (!formData.DOB || dobDate > today) {
      currentErrors.DOB = "Enter a valid date of birth";
    }
    if (
      !mobileNoRegEx.test(formData.MobileNo) ||
      parseInt(formData.MobileNo) < 6000000000
    ) {
      currentErrors.MobileNo = "Enter a valid 10-digit mobile number";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URI}/freelancer/${freelancerData.UserName}/profile`,
        formData
      );
      if (res.data === "success") {
        alert("Profile updated successfully");
        window.location.reload();
      }
    } catch (err) {
      alert("Error updating profile");
      console.error(err);
    }
  };

  return (
    <div className="freelanceDetail freelanceProfile">
      <div className="topHeader">
        <h1>Edit Profile</h1>
      </div>
      <div className="briefDetails">
        <form onSubmit={handleSubmit} className="block1">
          <div>
            <label>UserName:</label>
            <input type="text" value={formData.UserName} disabled />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="FirstName"
              value={formData.FirstName}
              onChange={handleChange}
            />
            {errors.FirstName && <p>{errors.FirstName}</p>}
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="LastName"
              value={formData.LastName}
              onChange={handleChange}
            />
            {errors.LastName && <p>{errors.LastName}</p>}
          </div>
          <div>
            <label>Email:</label>
            <input type="email" value={formData.Email} disabled />
          </div>
          <div>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
            />
            {errors.DOB && <p>{errors.DOB}</p>}
          </div>
          <div>
            <label>Mobile Number:</label>
            <input
              type="text"
              name="MobileNo"
              value={formData.MobileNo}
              onChange={handleChange}
            />
            {errors.MobileNo && <p>{errors.MobileNo}</p>}
          </div>
          <div>
            <label>Skills:</label>
            <input
              type="text"
              name="Skill"
              value={formData.Skill}
              onChange={handleChange}
            />
          </div>
          <p>Bio:</p>
          <div>
            <label>Worked At:</label>
            <input
              type="text"
              name="workedAt"
              value={formData.bio?.workedAt}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Skills:</label>
            <input
              type="text"
              name="experience"
              value={formData.bio?.experience}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </form>

        <Form method="Delete">
          <legend>Delete Account</legend>
          <button type="submit" name="action" value="delete">Delete</button>
        </Form>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const userId = params.userId;

  try {
    // If this is a delete request
    if (formData.delete === "delete") {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URI}/freelancer/${userId}/profile`
      );

      if (res.data === "success") {
        return redirect("/");
      } else {
        throw new Error("Failed to delete account");
      }
    }

    // Otherwise, assume it's an update (you could expand this if needed)
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URI}/freelancer/${userId}/profile`,
      formData
    );

    if (res.data === "success") {
      window.location.reload();

    } else {
      throw new Error("Failed to update profile");
    }
  } catch (error) {
    console.error("Action error:", error);
    return null; // You can return error info here if needed
  }
}