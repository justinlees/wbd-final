import React from "react";
import {
  useOutletContext,
  useParams,
  Form,
  Outlet,
  redirect,
} from "react-router-dom";
import axios from "axios";

export default function FMessages() {
  const freelancer = useOutletContext();
  const params = useParams();
  //const [data, setData] = React.useState("");
  return (
    <div className="freelanceDetail">
      <div className="topHeader">
        <h1>Messages</h1>
      </div>
      <div className="briefDetails">
        <div className="block1">
          {freelancer.tasksAssigned?.map((item) => {
            if (item.clientId === params.userId) {
              return (
                <div style={{ backgroundColor: "#afafaf" }}>
                  <p>{item.clientId}</p>
                  <p>{item.taskName}</p>
                  <p>{item.taskDescription}</p>
                </div>
              );
            }
          })}
          <Outlet />
          <Form
            method="post"
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="message..."
              name="msgContent"
              required
              style={{
                width: "18rem",
                border: "none",
                lineHeight: "1.5rem",
                borderTopLeftRadius: "8px",
                borderBottomLeftRadius: "8px",
                backgroundColor: "#ccc",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#111",
                color: "white",
                border: "none",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
                lineHeight: "1.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i className="fa-solid fa-arrow-right-long"></i>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const response = await axios.post(
    `http://localhost:5500/freelancer/${params.fUser}/tasks/${params.userId}/messages`,
    formData
  );
  if (response.data) {
    return redirect(
      `/freelancer/${params.fUser}/tasks/${params.userId}/messages`
    );
  }
}
