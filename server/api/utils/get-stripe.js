const { Stripe } = require("stripe");
const getStripe = () => {
  const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY
  if (!stripePrivateKey) {
    throw ("Environment variable required: STRIPE_PRIVATE_KEY");
  }
  const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {});
  return stripe;
};

module.exports = { getStripe };
