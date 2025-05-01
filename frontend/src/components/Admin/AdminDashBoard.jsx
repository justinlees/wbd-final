import React from "react";
import { useOutletContext } from "react-router-dom";

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
          allClients?.allClients.map((item) => (
            <div className="briefContent">
              <p>User Id:{item.UserName}</p>
              <p>Email:{item.Email}</p>
              <p>Mobile No:{item.MobileNo}</p>
            </div>
          ))
        ) : (
          <p>No existing files</p>
        )}
      </div>
    </div>
  );
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
