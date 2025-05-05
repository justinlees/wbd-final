import React, { useState } from "react";
import { useActionData, useOutletContext } from "react-router-dom";
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
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/freelancer/${freelancerData.UserName}/create-payment-intent`,
        { amount }
      );

      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error(result.error.message);
        alert("Payment failed");
      } else if (result.paymentIntent.status === "succeeded") {
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
    <div
      className="freelanceDetail freelanceEarnings"
      style={{ padding: "2rem" }}
    >
      <div
        className="topHeader"
        style={{ textAlign: "center", marginBottom: "2rem" }}
      >
        <h1>Wallet</h1>
      </div>
      <div
        className="briefDetails"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          className="block1"
          style={{
            width: "400px",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
          }}
        >
          {errors && <span style={{ color: "red" }}>{errors}</span>}
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Add money</p>
          <div
            className="balance"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Balance: ${freelancerData.currAmount}
          </div>
          <form onSubmit={handlePayment}>
            <legend style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              Enter Amount
            </legend>
            <input
              type="number"
              name="amount"
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                marginBottom: "1rem",
              }}
            />
            <legend style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>
              Card Details
            </legend>
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!stripe || loading}
              style={{
                width: "100%",
                padding: "0.8rem",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "#ffffff",
                backgroundColor: "#635bff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Processing..." : `Pay $${freelancerData.currAmount}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}