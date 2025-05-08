import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Form, useOutletContext, redirect } from "react-router-dom";

export default function Explore() {
  const [tasks, setTasks] = useState([]);
  const { fUser } = useParams();
  const [acceptFlag, setAcceptFlag] = React.useState("");
  const [requestVal, setRequestVal] = React.useState("");
  const freelancerData = useOutletContext();

  useEffect(() => {
    const exploreTasks = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/freelancer/${fUser}/explore`
        );
        setTasks(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    exploreTasks();
  }, [fUser]);

  return (
    <div className="briefDetails" style={{ zIndex: 1000, margin: "auto" }}>
      <div className="block1">
        <h2>Available Tasks</h2>
        {tasks.length ? (
          tasks.map((task, index) => (
            <>
              <div key={index} className="taskCard">
                <h3>{task.taskName}</h3>
                <p>{task.taskDescription}</p>
                {task.postedBy && (
                  <small>Posted by: {task.postedBy || "Unknown"}</small>
                )}
                <button>Accept Task</button>
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
                    value={task.clientIds}
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    value={task.taskName}
                    name="taskName"
                    style={{ display: "none" }}
                  />
                  <input
                    type="text"
                    name="taskDescription"
                    value={task.taskDescription}
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
            </>
          ))
          
        ) : (
          <p>No tasks to explore.</p>
        )
        }
      </div>
    </div>
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
