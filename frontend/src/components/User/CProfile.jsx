import React, { useState } from "react";
import { useOutletContext, redirect } from "react-router-dom";
import axios from "axios";

export default function CProfile() {
  const clientData = useOutletContext();
  const user = clientData.user;

  const [formData, setFormData] = useState({
    FirstName: user.FirstName || "",
    LastName: user.LastName || "",
    DOB: new Date(user.DOB).toISOString().split("T")[0],
    Email: user.Email || "",
    MobileNo: user.MobileNo || "",
    UserName: user.UserName || "",
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   try {
  //     console.log("entered");;
  //     const res = await axios.put(
  //       `${process.env.REACT_APP_BACKEND_URI}/home/${user.UserName}/profile`,
  //       formData
  //     );
  //     console.log("catched response"); 
  //     if (res.data === "success") {
  //       alert("Profile updated successfully");
  //       window.location.reload();
  //     }
  //   } catch (err) {
  //     alert("Error updating profile");
  //     console.error(err);
  //   }
  // };

  return (
    <div className="userDetail userProfile">
      <div className="topHeader">
        <h1>Edit Profile</h1>
      </div>
      <div className="briefDetails">
        <form className="block1">
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
          <button type="submit">Save Changes</button>
        </form>

        <form method="DELETE">
          <legend>Delete Account</legend>
          <button type="submit" name="action" value="delete">Delete</button>
        </form>
        <form action="" method="delete"></form>
      </div>
    </div>
  );
}


export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const userId = params.userId;

  try {
    // If this is a delete request
    if (formData.action === "delete") {
      const res = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URI}/home/${userId}/profile`
      );

      if (res.data === "success") {
        return redirect("/")
      } else {
        throw new Error("Failed to delete account");
      }
    }

    else{
      // Otherwise, assume it's an update (you could expand this if needed)
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URI}/home/${userId}/profile`,
        formData
      );

      if (res.data === "success") {
        window.location.reload();
      } else {
        throw new Error("Failed to update profile");
      }
    }
  } catch (error) {
    console.error("Action error:", error);
    return null; // You can return error info here if needed
  }
}
