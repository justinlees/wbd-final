import React from "react";
import { useLoaderData, NavLink, Outlet } from "react-router-dom";
import axios from "axios";

export default function CTasks() {
  const requestedTasks = useLoaderData();
  console.log(requestedTasks);
  return (
    <div className="ClientTasks">
      <div className="top-nav">
        <section>
          <NavLink
            to="."
            end
            className={({ isActive }) => (isActive ? "activeTasks" : "")}
          >
            <div className="navigations">Queued</div>
          </NavLink>
          <NavLink
            to="acceptedTasks"
            className={({ isActive }) => (isActive ? "activeTasks" : "")}
          >
            <div className="navigations">Accepted</div>
          </NavLink>
          <NavLink
            to="recentTasks"
            className={({ isActive }) => (isActive ? "activeTasks" : "")}
          >
            <div className="navigations">Recent</div>
          </NavLink>
        </section>
        <div className="taskData">
          <Outlet context={requestedTasks} />
        </div>
      </div>
    </div>
  );
}

export async function Loader({ params }) {
  const res = await axios.get(
    `${process.env.REACT_APP_BACKEND_URI}/home/${params.userId}/tasks`
  );
  return res.data;
}
