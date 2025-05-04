import React from "react";
import {
  useOutletContext,
  useActionData,
  Form,
  redirect,
} from "react-router-dom";
import axios from "axios";

export default function CRequestedTasks() {
  const requestedTasks = useOutletContext();
  const errors = useActionData();
  return (
    <div className="connections">
      <h1>Queued Tasks</h1>
      {errors?.cancel && <span>{errors.cancel}</span>}
      {requestedTasks.bufferRequests?.map((item, index) => (
        <div key={index} className="block1">
          <Form method="post">
            <h3>TaskName: {item.taskName}</h3>
            <p>Description: {item.taskDescription}</p>
            <input
              type="text"
              value={requestedTasks.UserName}
              name="UserName"
              style={{ display: "none" }}
            />
            <input
              type="text"
              value={item.lancerIds}
              name="lancerIds"
              style={{ display: "none" }}
            />
            <button type="submit" style={{ width: "6rem", lineHeight: "2rem" }}>
              Cancel
            </button>
          </Form>
        </div>
      ))}
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const errors = {};
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/tasks`,
    formData
  );

  if (response.data === "requestCancel") {
    return redirect(`/home/${params.userId}/tasks`);
  } else {
    errors.cancel = "request Not processed. Try again.";
    return errors;
  }
}
