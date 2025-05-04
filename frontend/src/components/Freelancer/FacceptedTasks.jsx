import React from "react";
import { useOutletContext, Link, Form } from "react-router-dom";
import axios from "axios";

export default function FacceptedTasks() {
  const freelancerData = useOutletContext();
  const [Mark, setMark] = React.useState("");
  return (
    <>
      {freelancerData.tasksAssigned.length ? (
        freelancerData.tasksAssigned.map((item, index) => (
          <div key={index} className="acceptedTasks block1">
            <div className="acceptedRequests">
              <h3>{item.clientId}</h3>
              <p>{item.taskName}</p>
              <p>{item.taskDescription}</p>
              <div className="acceptButtons">
                <button type="button" style={{ backgroundColor: "black" }}>
                  <Link
                    to={`../${item.clientId}/messages`}
                    style={{
                      color: "white",
                      textDecoration: "none",
                      display: "block",
                    }}
                  >
                    Message
                  </Link>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMark(1);
                  }}
                >
                  Mark Complete
                </button>
                {Mark ? (
                  <div className="PopUp">
                    <Form method="POST">
                      <input
                        text="text"
                        value={item.clientId}
                        name="clientId"
                        style={{ display: "none" }}
                      />
                      <input
                        text="text"
                        value={item.taskName}
                        name="taskName"
                        style={{ display: "none" }}
                      />
                      <button type="submit" id="confirmation">
                        Mark Complete
                      </button>
                      <button
                        id="cancel"
                        onClick={() => {
                          setMark(0);
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
        ))
      ) : (
        <div className="acceptedClients block1">
          <h3>No Tasks Accepted ....................</h3>
        </div>
      )}
    </>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const res = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}/tasks/acceptedTasks`,
    formData
  );
  if (res) {
    return "";
  }
}
