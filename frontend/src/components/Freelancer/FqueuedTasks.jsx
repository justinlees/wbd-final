import React from "react";
import { useOutletContext, Form, Outlet, redirect } from "react-router-dom";
import axios from "axios";

export default function FqueuedTasks() {
  const freelancerData = useOutletContext();
  const [requestVal, setRequestVal] = React.useState("");
  const [acceptFlag, setAcceptFlag] = React.useState("");
  const [requestFlag, setRequestFlag] = React.useState("");
  return (
    <>
      {freelancerData.bufferRequests.length ? (
        freelancerData.bufferRequests.map((item, index) => (
          <div key={index} className="requestedClients block1">
            <h3>{item.clientIds}</h3>
            <p>{item.taskName}</p>
            <p>{item.taskDescription}</p>
            <div className="requestButtons">
              <button
                className="accept"
                type="button"
                style={{ backgroundColor: "cyan" }}
                onClick={() => {
                  setAcceptFlag(1);
                }}
              >
                Accept
              </button>
              <button
                className="reject"
                type="button"
                onClick={() => {
                  setRequestFlag(1);
                }}
              >
                Reject
              </button>
            </div>
            {acceptFlag ? (
              <div className="PopUp">
                <Form method="POST">
                  <p>Please pay the platform fee of $2</p>
                  <input
                    type="text"
                    value={requestVal}
                    name="requestVal"
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="clientIds"
                    value={item.clientIds}
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    value={item.taskName}
                    name="taskName"
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="taskDescription"
                    value={item.taskDescription}
                    style={{ display: "none" }}
                  />
                  <legend>Current Balance:{freelancerData.currAmount}</legend>
                  <input
                    type="Number"
                    name="currAmount"
                    value={freelancerData.currAmount}
                    style={{ display: "none" }}
                  />
                  <button
                    type="submit"
                    id="confirmation"
                    onClick={() => {
                      setRequestVal("accept");
                    }}
                  >
                    Proceed
                  </button>
                  <button
                    id="cancel"
                    type="button"
                    onClick={() => {
                      setAcceptFlag(0);
                    }}
                  >
                    Cancel
                  </button>
                </Form>
              </div>
            ) : (
              ""
            )}

            {requestFlag ? (
              <div className="PopUp">
                <Form method="POST">
                  <p>Do you want to reject the task?</p>
                  <input
                    type="text"
                    value={requestVal}
                    name="requestVal"
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="clientIds"
                    value={item.clientIds}
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    value={item.taskName}
                    name="taskName"
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="taskDescription"
                    value={item.taskDescription}
                    style={{ display: "none" }}
                  />
                  <button
                    type="submit"
                    id="confirmation"
                    onClick={() => {
                      setRequestVal("reject");
                    }}
                  >
                    Reject
                  </button>
                  <button
                    id="cancel"
                    type="button"
                    onClick={() => {
                      setRequestFlag(0);
                    }}
                  >
                    Cancel
                  </button>
                </Form>
              </div>
            ) : (
              ""
            )}

            <Outlet context={item} />
          </div>
        ))
      ) : (
        <div className="requestedClients block1">
          <h3>No Tasks in QUEUE ....................</h3>
        </div>
      )}
    </>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  console.log(formData);
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}/tasks`,
    formData
  );
  console.log(response.data);
  if (response.data) {
    return redirect(`/freelancer/${params.fUser}/tasks`);
  }
}
