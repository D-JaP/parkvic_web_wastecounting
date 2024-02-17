import React, { useEffect, useState } from "react";
import Navbar from "../MainPage/Navbar";
import {
  loadStripe,
  PaymentIntent,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../SubscribeComponent/CheckoutForm";
import Plan from "../SubscribeComponent/Plan";
// import scss
import "./Subscribe.scss";
import { payment_api_path } from "../../config";
// public key
const stripePromise = loadStripe(
  "pk_test_51OStMRK7FXjDgqHM2QtFH6tLWz0iEExwBwtsDccsWtTDusa5gZXesiw9lsQUWxCbAQNb63oephQ6ksoH0Rogc5QE00mJVCZySb"
);
const paymentIntentUrl = payment_api_path;

function Subscribe() {
  // show card form and create payment intent
  const [payElementWidth, setpayElementWidth] = useState<string>("100px");
  const [show, setShow] = useState<boolean>(false);
  const [clientSecret, setclientSecret] = useState<string>("");
  const [paymentIntent, setpaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  const HandleOnSubscibe = async () => {
    // get payment intent
    await fetch(paymentIntentUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify( { amount: 99, currency: "aud"}),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        setpaymentIntent(data["paymentIntent"]);
        // set client secret
        const secret = data["paymentIntent"]["client_secret"];
        setclientSecret(secret);
        // set width of card form
        setpayElementWidth("100%");
        setShow(true);
      });
  };

  const options: StripeElementsOptions = {
    mode: "payment",
    amount: 99,
    currency: "aud",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
    paymentMethodConfiguration: "pmc_1OUHlvK7FXjDgqHM3HBM5B3S",
  };

  return (
    <>
      <Navbar />
      <h2 className="text-center mt-4 mb-4">Subscribe</h2>
      <div className="d-flex justify-content-center container ms-auto me-auto">
        <Plan onsubscribe={HandleOnSubscibe}></Plan>
        {clientSecret !== "" ? (
          <div
            style={{ overflow: "hidden", maxWidth: payElementWidth }}
            className={`animation ${show ? "show" : "collapse"}`}
          >
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm clientSecret={clientSecret}></CheckoutForm>
            </Elements>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Subscribe;
