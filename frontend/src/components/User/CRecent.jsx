import React from "react";
import { useOutletContext } from "react-router-dom";

export default function CRecent() {
  const clientData = useOutletContext();
  return (
    <>
      {clientData.finishedTasks.length ? (
        clientData.finishedTasks.map((item, index) => (
          <div key={index} className="acceptedTasks block1">
            <div className="acceptedRequests">
              <h3>{item.lancerId}</h3>
              <div className="acceptButtons">
                <button type="button">Info</button>
              </div>
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
