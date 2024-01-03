import { HttpResponse, http } from "msw";

export const paymentIntentMock = [
  http.post("/payment_intents", () => {
    return HttpResponse.json({
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: {
        paymentIntent: {
          id: "pi_3OULKyK7FXjDgqHM1HQ9BMto",
          object: "payment_intent",
          amount: 200,
          amount_capturable: 0,
          amount_details: { tip: {} },
          amount_received: 0,
          application: null,
          application_fee_amount: null,
          automatic_payment_methods: {
            allow_redirects: "always",
            enabled: true,
          },
          canceled_at: null,
          cancellation_reason: null,
          capture_method: "automatic",
          client_secret:
            "pi_3OULKyK7FXjDgqHM1HQ9BMto_secret_SQ8kXDTOf3CzXslhKJAdj1SFa",
          confirmation_method: "automatic",
          created: 1704253308,
          currency: "aud",
          customer: null,
          description: null,
          invoice: null,
          last_payment_error: null,
          latest_charge: null,
          livemode: false,
          metadata: {},
          next_action: null,
          on_behalf_of: null,
          payment_method: null,
          payment_method_configuration_details: {
            id: "pmc_1OUHIgK7FXjDgqHMKSlMhrep",
            parent: null,
          },
          payment_method_options: {
            card: {
              installments: null,
              mandate_options: null,
              network: null,
              request_three_d_secure: "automatic",
            },
            link: { persistent_token: null },
          },
          payment_method_types: ["card", "link"],
          processing: null,
          receipt_email: null,
          review: null,
          setup_future_usage: null,
          shipping: null,
          source: null,
          statement_descriptor: null,
          statement_descriptor_suffix: null,
          status: "requires_payment_method",
          transfer_data: null,
          transfer_group: null,
        },
      },
    });
  }),
];
