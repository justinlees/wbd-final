import React from "react";
import { useOutletContext } from "react-router-dom";

export default function AProfile() {
  const adminData = useOutletContext();
  console.log(adminData);
  return (
    <div className="adminProfile">
      <div className="topHeader">
        <h1>
          Admin <span>Profile</span>
        </h1>
      </div>
      <div className="briefDetails">
        <div className="briefContent">
          <h2>{adminData.admin.UserName}</h2>
          <p>FirstName: {adminData.admin.FirstName}</p>
          <p>LastName: {adminData.admin.LastName}</p>
          <p>Email: {adminData.admin.Email}</p>
          <p>Mobile: {adminData.admin.MobileNo}</p>
        </div>
      </div>
    </div>
  );
}
