import React from "react";
import { useOutletContext } from "react-router-dom";

export default function Profit() {
  const adminDetails = useOutletContext();
  console.log(adminDetails.admin.currAmount);
  return (
    <div className="adminDetail">
      <div className="topHeader">
        <h1>
          <span>Profits</span>
        </h1>
      </div>
      <div className="briefDetails">
        <div className="briefContent">
          <h3>Money Deposited:</h3>
          <p
            style={{
              backgroundColor: "#dedede",
              lineHeight: "3rem",
              width: "6rem",
              padding: "0.5rem",
            }}
          >
            $ {adminDetails.admin.currAmount}
          </p>
        </div>
      </div>
    </div>
  );
}
