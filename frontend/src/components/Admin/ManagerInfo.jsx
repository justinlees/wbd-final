import React from "react";
import { Form, useLoaderData } from "react-router-dom";
import axios from "axios";

export default function ManagersInfo() {
  const allLancers = useLoaderData();
  console.log(allLancers);
  return (
    <div className="adminDetail">
      <div className="topHeader">
        <h1>
          <span>Freelancer</span> Info
        </h1>
      </div>
      <div className="briefDetails">
        {allLancers?.map((item, index) => (
          <div key={index} className="briefContent">
            <h3>UserName: {item.UserName}</h3>
            <p>Email: {item.Email}</p>
            <p>Mobile: {item.MobileNo}</p>
            <p>Skill: {item.Skill}</p>
            <Form method="post">
              <div className="display1">
                <input
                  type="text"
                  name="lancerId"
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
        ))}
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());

  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/admin/${params.aUser}/utilities`,
    formData
  );
  console.log(response.data);
  if (response.data) {
    return "";
  }
}

export async function Loader({ request, params }) {
  const res = await axios
    .get(`${process.env.REACT_APP_BACKEND_URI}/admin/${params.aUser}/utilities`)
    .then((res) => res)
    .then((data) => data.data);
  if (res) {
    return res;
  }
}
