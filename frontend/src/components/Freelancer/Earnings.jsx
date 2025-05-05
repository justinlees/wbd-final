import React, { useState } from "react";
import {
  Form,
  redirect,
  useActionData,
  useOutletContext,
} from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");

    // Step 1: Get PaymentIntent from backend
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}/payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amount * 100 }), // in cents
    });

    const { clientSecret } = await res.json();

    // Step 2: Confirm Card Payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    setProcessing(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        onSuccess(); // reload or update wallet
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={!stripe || processing} style={{ marginTop: "1rem" }}>
        {processing ? "Processing..." : "Pay Now"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default function Earnings() {
  const errors = useActionData();
  const freelancerData = useOutletContext();
  const [amount, setAmount] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

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

          {!showCheckout ? (
            <>
              <legend>Enter Amount</legend>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <br />
              <button
                style={{ marginTop: "1rem" }}
                onClick={() => setShowCheckout(true)}
              >
                Continue to Pay
              </button>
            </>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm
                amount={amount}
                onSuccess={() => {
                  window.location.reload();
                }}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

export async function Action({ request, params }) {
  const formData = Object.fromEntries(await request.formData());
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URI}/freelancer/${params.fUser}/earnings`,
    formData
  );

  if (!response) {
    return "money not added to wallet";
  } else {
    return redirect(`/freelancer/${params.fUser}/earnings`);
  }
}
