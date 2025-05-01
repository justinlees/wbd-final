import React from "react";
import { useOutletContext } from "react-router-dom";

export default function MProfile() {
  const managerData = useOutletContext();
  return (
    <div className="managerProfile">
      <div className="topHeader">
        <h1>
          Manager <span>Profile</span>
        </h1>
      </div>
      <div className="briefDetails">
        <div className="briefContent">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus
            placeat consectetur esse tempore nobis necessitatibus. Veritatis
            quam aspernatur culpa, suscipit consectetur sint vel dignissimos
            voluptatem totam, aut doloribus in? Officia?
          </p>
        </div>
      </div>
    </div>
  );
}
