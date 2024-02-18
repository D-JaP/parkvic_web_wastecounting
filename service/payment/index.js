const stripe = require('stripe')(process.env.STRIPE_SECRET);
const axios = require('axios');
const userinfo_url = process.env.USER_ENDPOINT;
exports.handler = async (event, context, callback) => {
    try {
        // Parse event body JSON
        const body = JSON.parse(event.body);
        // Extract amount and currency from the request body
        const { amount, currency, email} = body;
        
        // Check if amount and currency are provided
        if (!amount || !currency) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: 'Missing crucial parameters in request body'
                })
            };
        }
        
        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount : amount,
            currency: currency,
            description: "Parkvic App Payment Intent",
            receipt_email: email
        });
        
        // Return the PaymentIntent in the response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'https://parkvic-app.harry-playground.click'
            },

            body: JSON.stringify({
                paymentIntent
            })
        };
    } catch (error) {
        // Handle errors
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `An error occurred while processing the payment. Message: ${error.message}`
            })
        };
    }
};
