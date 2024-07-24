const { getStripe } = require("../utils/get-stripe");

const getStripeCheckoutSession = async (userEmail, priceId) => {
  const stripe = getStripe();
  const successUrl = null 
  if (!successUrl) {
    throw ("Stripe success URL required")
  }
  const params = {
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    success_url: successUrl,
  };

  const session = await stripe.checkout.sessions.create(params);
  return session;
};

module.exports = { getStripeCheckoutSession };
