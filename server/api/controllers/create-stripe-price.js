const { getStripe } = require("../utils/get-stripe");

const createStripePrice = async (amount) => {
  const stripe = getStripe();
  const productId = process.env.PRODUCT_ID
  if (!productId) {
    throw ('Environment variable required: PRODUCT_ID')
  }
  // Note: it's possible to change the productId based on amount
  return await stripe.prices.create({
    currency: "usd",
    unit_amount: amount,
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    productId,
  });
};

module.exports = { createStripePrice };
