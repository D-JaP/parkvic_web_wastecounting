import React, { CSSProperties, useState } from "react";
import ReactDOM from "react-dom";
import { StripeCardElement, StripeElement, loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  PaymentElement,
  
} from "@stripe/react-stripe-js";

import './CheckoutForm.scss'

const CheckoutForm = ({clientSecret}:{clientSecret:string}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errMsg, seterrMsg] = useState<string>()
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    await elements?.submit().catch((err) => {
      seterrMsg(err.message)
      return
    });
    

    if (stripe && elements) {
      const {error} = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: 'http://localhost:3000/'
        }
      });
      if (error){
        seterrMsg(error.message)
      }
    }
  };

  
  return (
    <form onSubmit={handleSubmit} className="checkout-form d-flex flex-column" >
      <PaymentElement />
      <button type="submit" disabled={!stripe} className="pay-btn" >
        Pay <span>$0.99</span>
      </button>
      {errMsg && <div className="error">{errMsg}</div>}
    </form>
  );
};

export default CheckoutForm;