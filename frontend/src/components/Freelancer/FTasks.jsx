import React from "react";
import { useOutletContext, NavLink, Outlet } from "react-router-dom";

export default function FTasks() {
  const freelancerData = useOutletContext();

  return (
    <div className="freelanceDetail freelanceTasks">
      <div className="topHeader">
        <h1>Freelancer Tasks</h1>
      </div>
      <div className="top-nav">
        <NavLink
          to="."
          end
          className={({ isActive }) => (isActive ? "activeTasks" : "")}
        >
          <div>Queued</div>
        </NavLink>
        <NavLink
          to="acceptedTasks"
          className={({ isActive }) => (isActive ? "activeTasks" : "")}
        >
          <div>Accepted</div>
        </NavLink>
        <NavLink
          to="recentTasks"
          className={({ isActive }) => (isActive ? "activeTasks" : "")}
        >
          <div>Recent</div>
        </NavLink>
      </div>

      <div className="briefDetails">
        <Outlet context={freelancerData} />
      </div>
    </div>
  );
}
