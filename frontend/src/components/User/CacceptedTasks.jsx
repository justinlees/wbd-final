import React from "react";
import { useOutletContext, useActionData, Link } from "react-router-dom";

export default function CAcceptedTasks() {
  const requestedTasks = useOutletContext();
  const errors = useActionData();
  return (
    <div className="connections">
      <h1>Accepted Tasks</h1>
      {errors?.cancel && <span>{errors.cancel}</span>}
      {requestedTasks.tasksRequested?.map((item, index) => (
        <div key={index} className="block1">
          <article>
            <p>
              <b>TaskName:</b> {item.taskName}
            </p>
            <p>
              <b>Description:</b> {item.taskDescription}
            </p>
          </article>
          <Link to={`../${item.lancerId}/messages`}>Message</Link>
        </div>
      ))}
    </div>
  );
}
