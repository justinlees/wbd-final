import React from "react";
import { Form,redirect,useActionData,useOutletContext } from "react-router-dom";
import axios from "axios";

export default function Earnings() {
  const errors = useActionData();
  const freelancerData = useOutletContext();
  //console.log(freelancerData.currAmount);
  return (
    <div className="freelanceDetail freelanceEarnings">
      <div className="topHeader">
        <h1>Wallet</h1>
      </div>
      <div className="briefDetails">
        <div className="block1">
          {errors&&<span>{errors}</span>}
          <p>Add money</p>
          <div className="balance"><b>${freelancerData.currAmount}</b></div>
          <Form method="POST">
            <legend>UPI ID</legend>
            <input type="text" name="upiId" required/>
            <legend>Enter Amount</legend>
            <input type="number" name="amount" required/>
            <br />
            <button
              style={{
                marginTop: "1rem",
                backgroundColor: "black",
                color: "white",
                cursor: "pointer",
              }}
            >
              Add Money
              <span
                style={{
                  backgroundColor: "gold",
                  color: "black",
                  borderRadius: "50%",
                  marginLeft: "0.3rem",
                  padding: " 0.3rem 0.5rem",
                  lineHeight: "2rem",
                }}
              >
                $
              </span></button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export async function Action({request,params}){
  const formData = Object.fromEntries(await request.formData());
  const response = await axios.post(`http://localhost:5500/freelancer/${params.fUser}/earnings`,formData);

  if(!response){
    return "money not added to wallet";
  } else {
    return redirect(`/freelancer/${params.fUser}/earnings`);
  }
}