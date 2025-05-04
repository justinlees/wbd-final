import React from "react";
import { useOutletContext } from "react-router-dom";
export default function FRecent() {
  const freelancerData = useOutletContext();
  return (
    <>
      {freelancerData.finishedTasks.length ? (
        freelancerData.finishedTasks.map((item, index) => (
          <div key={index} className="acceptedTasks block1">
            <div className="acceptedRequests">
              <h3>{item.clientId}</h3>
              <p>{item.taskName}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="acceptedClients block1">
          <h3>No Recent Tasks ....................</h3>
        </div>
      )}
    </>
  );
}
