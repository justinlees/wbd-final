import React from "react";
import { useOutletContext, Form, redirect } from "react-router-dom";

import axios from "axios";

export default function FProfile() {
  const freelancerData = useOutletContext();
  const [showPopUp, setShowPopUp] = React.useState("");

  return (
    <div className="freelanceDetail freelanceProfile">
      <div className="topHeader">
        <h1>Profile Page</h1>
      </div>
      <div className="briefDetails">
        <div className="block1">
          <img alt="" />
          <h3>UserName: {freelancerData.UserName}</h3>
          <br />
          <p>FirstName: {freelancerData.FirstName}</p>
          <p>LastName: {freelancerData.LastName}</p>
          <p>Skills: {freelancerData.Skill}</p>
          <p>Email: {freelancerData.Email}</p>
          <p>Phone Number: {freelancerData.MobileNo}</p>
          <p
            onClick={() => {
              setShowPopUp(1);
            }}
            style={{ color: "tomato", cursor: "pointer" }}
          >
            Account Deletion
          </p>
          {showPopUp ? (
            <div className="PopUp">
              <Form method="POST">
                <div>
                  <p>
                    Once you click "delete", all your data will be gone and your
                    account will not be seen to others.
                  </p>
                  <br />
                  <b>Confirm Deletion</b>
                </div>

                <input
                  type="text"
                  value="delete"
                  name="delete"
                  style={{ display: "none" }}
                />
                <button type="submit">Delete</button>
                <button
                  type="button"
                  className="cancel"
                  onClick={() => {
                    setShowPopUp(0);
                  }}
                >
                  Cancel
                </button>
              </Form>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}/profile`,
    formData
  );
  if (res === "success") {
    return redirect("/");
  } else {
    return "";
  }
}
