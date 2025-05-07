import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Explore() {
  const [tasks, setTasks] = useState([]);
  const { fUser } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const exploreTasks = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URI}/freelancer/${fUser}/explore`
        );
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    exploreTasks();
  }, [fUser]);

  const handleAccept = async (task) => {
    const formData = {
      requestVal: "accept",
      clientIds: task.clientIds || "unknown",
      taskName: task.taskName,
      taskDescription: task.taskDescription,
      currAmount: task.currAmount || 0, // Optional, include if available
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/freelancer/${fUser}/tasks`,
        formData
      );

      if (response.data) {
        navigate(`/freelancer/${fUser}/tasks`);
      }
    } catch (error) {
      console.error("Error accepting task:", error);
    }
  };

  return (
    <div className="briefDetails" style={{ zIndex: 1000 }}>
      <div className="block1">
        <h2>Available Tasks</h2>
        {tasks.length ? (
          tasks.map((task, index) => (
            <div key={index} className="taskCard">
              <h3>{task.taskName}</h3>
              <p>{task.taskDescription}</p>
              {task.postedBy && (
                <small>Posted by: {task.postedBy.UserName || "Unknown"}</small>
              )}
              <button onClick={() => handleAccept(task)}>Accept Task</button>
            </div>
          ))
        ) : (
          <p>No tasks to explore.</p>
        )}
      </div>
    </div>
  );
}
