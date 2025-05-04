import React from "react";
import { useOutletContext, Form, redirect } from "react-router-dom";
import axios from "axios";

export default function AdminDashBoard() {
  const allClients = useOutletContext();
  console.log(allClients);
  return (
    <div className="adminDetail">
      <div className="topHeader">
        <h1>
          Admin <span>DashBoard</span>
        </h1>
      </div>
      <div
        className="head"
        style={{
          width: "100%",
          height: "8rem",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#ededed",
        }}
      >
        <h2 style={{ margin: "1rem" }}>
          User <span>Details</span>
        </h2>
      </div>
      <div className="briefDetails">
        {allClients ? (
          allClients?.allClients.map((item, index) => (
            <div key={index} className="briefContent">
              <p>User Id:{item.UserName}</p>
              <p>Email:{item.Email}</p>
              <p>Mobile No:{item.MobileNo}</p>
              <Form method="post">
                <div className="display1">
                  <input
                    type="text"
                    name="clientId"
                    value={item.UserName}
                    style={{ display: "none" }}
                  />
                </div>
                <fieldset style={{ border: "none" }}>
                  <button
                    type="submit"
                    style={{
                      width: "6rem",
                      lineHeight: "2rem",
                      backgroundColor: "tomato",
                      margin: "1rem",
                      border: "1px solid black",
                      borderRadius: "8px",
                      boxShadow: "1px 1px 6px #333",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </fieldset>
              </Form>
            </div>
          ))
        ) : (
          <p>No existing files</p>
        )}
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());

  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/admin/${params.aUser}`,
    formData
  );
  console.log(response.data);
  if (response.data) {
    window.location.reload();
    return redirect(`admin/${params.aUser}`);
  }
}

// export async function Loader({ request, params }) {
//   const res = await axios
//     .get(`http://localhost:5500/admin/${params.aUser}`)
//     .then((res) => res)
//     .then((data) => data.data);
//   if (res) {
//     return res;
//   } else {
//     return "no existing file";
//   }
// }
