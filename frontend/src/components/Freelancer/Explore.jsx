import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Explore() {
  const [tasks, setTasks] = useState([]);
  const { fUser } = useParams(); // ✅ correctly get the route param here

  useEffect(() => {
    const exploreTasks = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/freelancer/${fUser}/explore`);
        setTasks(res.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    exploreTasks();
  }, [fUser]); // ✅ dependency added just in case

  return (
    <div className="exploreTasks block1">
      <h2>Available Tasks</h2>
      {tasks.length ? (
        tasks.map((task, index) => (
          <div key={index} className="taskCard">
            <h3>{task.taskName}</h3>
            <p>{task.taskDescription}</p>
            {task.postedBy && (
              <small>Posted by: {task.postedBy.UserName || 'Unknown'}</small>
            )}
          </div>
        ))
      ) : (
        <p>No tasks to explore.</p>
      )}
    </div>
  );
}
