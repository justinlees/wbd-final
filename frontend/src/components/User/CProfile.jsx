import React from "react";
import {
  useOutletContext,
  Form,
  redirect,
  useActionData,
} from "react-router-dom";
import axios from "axios";

export default function CProfile() {
  const clientData = useOutletContext();
  const response = useActionData();
  console.log(clientData);

  return (
    <div className="userDetail userProfile">
      <div className="topHeader">
        <h1>Profile Page</h1>
      </div>
      <div className="briefDetails">
        <div className="block1">
          <h3>UserName: {clientData.user.UserName}</h3>
          <br />
          <p>FirstName: {clientData.user.FirstName}</p>
          <p>LastName: {clientData.user.LastName}</p>
          <p>Email: {clientData.user.Email}</p>
          <p>Phone Number: {clientData.user.MobileNo}</p>
          <Form method="POST">
            <legend>Delete Account</legend>
            <input type="text" value="delete" name="delete" style={{display: "none"}}/>
            <button>Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const res = await axios.post(
    `http://localhost:5500/home/${params.userId}/profile`,
    formData
  );
  if (res === "success") {
    return redirect("/");
  } else {
    return "";
  }
}