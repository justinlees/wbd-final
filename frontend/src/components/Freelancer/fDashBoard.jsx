import React from "react";
import { useParams, useOutletContext } from "react-router-dom";

export default function FdashBoard() {
  const params = useParams();
  const freelancerData = useOutletContext();
  const filteredData = freelancerData.tasksAssigned[0];
  const finishedTasks =
    freelancerData.finishedTasks.length > 3
      ? freelancerData.finishedTasks.slice(-3)
      : freelancerData.finishedTasks;
  console.log(finishedTasks);
  return (
    <div className="freelanceDetail">
      <div className="topHeader2">
        <div className="left">
          <h1>DashBoard</h1>
          <h3>Hello {params.fUser}</h3>
        </div>
        <div className="right">
          <h2>CurrentTask</h2>
          <br />
          <section>
            <p>
              Task Name: <b>{filteredData ? filteredData.taskName : "none"}</b>
            </p>
            <p>
              Client Name:{" "}
              <b>{filteredData ? filteredData.clientId : "none"}</b>
            </p>
            <p>click here for more....</p>
          </section>
        </div>
      </div>
      <div className="briefDetails">
        <div className="block1">
          <h4>Recent Tasks</h4>
          {finishedTasks.length ? (
            finishedTasks.map((item, index) => (
              <React.Fragment key={index}>
                <br />
                <b>{item.clientId}</b>
                <p>{item.taskName}</p>
              </React.Fragment>
            ))
          ) : (
            <>
              <p>No recent Tasks</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
