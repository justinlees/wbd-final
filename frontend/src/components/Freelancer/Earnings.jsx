import React, { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function Earnings() {
  const errors = useActionData();
  const freelancerData = useOutletContext();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);

    const amount = event.target.amount.value;

    try {
      // Create a payment intent
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/freelancer/${freelancerData.UserName}/create-payment-intent`,
        { amount }
      );

      const clientSecret = data.clientSecret;

      // Confirm the payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert("Payment failed");
      } else if (result.paymentIntent.status === "succeeded") {
        // Update the freelancer's wallet
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/freelancer/${freelancerData.UserName}/earnings`,
          { amount }
        );
        alert("Payment successful! Money added to wallet.");
        window.location.reload();
      }
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="freelanceDetail freelanceEarnings">
      <div className="topHeader">
        <h1>Wallet</h1>
      </div>
      <div className="briefDetails">
        <div className="block1">
          {errors && <span>{errors}</span>}
          <p>Add money</p>
          <div className="balance">
            <b>${freelancerData.currAmount}</b>
          </div>
          <form onSubmit={handlePayment}>
            <legend>Enter Amount</legend>
            <input type="number" name="amount" required />
            <legend>Card Details</legend>
            <CardElement />
            <br />
            <button
              type="submit"
              disabled={!stripe || loading}
              style={{
                marginTop: "1rem",
                backgroundColor: "black",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "Processing..." : "Add Money"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}