import React from "react";
import { Form, useParams, useOutletContext, redirect } from "react-router-dom";
import axios from "axios";

export default function RequestPage() {
  const params = useParams();
  const userData = useOutletContext();
  const filterData = userData.freelancer.filter(
    (item) => item.UserName === params.fUser
  );

  return (
    <div className="requestPage">
      <h1>Task Request Page</h1>
      {filterData?.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            width: "40rem",
            height: "30rem",
            marginTop: "2rem",
            borderRadius: "8px",
            border: "1px solid black",
            boxShadow: "1px 1px 4px #222",
          }}
        >
          <div className="left">
            <ul>
              <li>
                <b>ClientInfo:</b>
              </li>
              <li>
                Name:
                <br />
                <b>
                  {item?.FirstName} {item?.LastName}
                </b>
              </li>
              <li>
                Email:
                <br />
                <b>{item.Email}</b>
              </li>
              <li>
                Mobile:
                <br />
                <b>{item?.MobileNo}</b>
              </li>
            </ul>
          </div>
          <div className="right">
            <Form method="post" encType="multipart/form-data">
              <h3>
                ClientId:
                <b> {item?.UserName}</b>
              </h3>
              <input type="text" value={params.fUser} name="lancerId" />
              <input
                type="text"
                value={userData.user.UserName}
                name="clientId"
              />
              <input
                type="text"
                placeholder="TaskName"
                name="taskName"
                required
                className="AboutTask"
                id="TaskName"
              />
              <input
                type="text"
                placeholder="Task Description...."
                name="taskDescription"
                required
                className="AboutTask"
                id="TaskDescription"
              />
              <input
                type="file"
                name="profilePic"
                style={{ backgroundColor: "black", display: "block" }}
              />
              <button type="submit">Request</button>
            </Form>
          </div>
        </div>
      ))}
    </div>
  );
}

export async function Action({ params, request }) {
  const formData = Object.fromEntries(await request.formData());
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/${params.fUser}/requestPage`,
    formData
  );
  if (res.data) return redirect(`/home/${params.userId}/tasks`);
}
