import React, { useState } from "react";
import { useOutletContext, redirect, useFetcher } from "react-router-dom";
import axios from "axios";

export default function CProfile() {
  const clientData = useOutletContext();
  const user = clientData.user;
  const fetcher = useFetcher();

  const [formData, setFormData] = useState({
    FirstName: user.FirstName || "",
    LastName: user.LastName || "",
    DOB: new Date(user.DOB).toISOString().split("T")[0],
    Email: user.Email || "",
    MobileNo: user.MobileNo || "",
    UserName: user.UserName || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="userDetail userProfile">
      <div className="topHeader">
        <h1>Edit Profile</h1>
      </div>
      <div className="briefDetails">
        <fetcher.Form className="block1">
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
              disabled
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="LastName"
              value={formData.LastName}
              disabled
            />
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
          </div>
          <div>
            <label>Mobile Number:</label>
            <input
              type="text"
              name="MobileNo"
              value={formData.MobileNo}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save Changes</button>
        </fetcher.Form>

        <fetcher.Form method="DELETE">
          <legend>Delete Account</legend>
          <button type="submit" name="action" value="delete">Delete</button>
        </fetcher.Form>
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
