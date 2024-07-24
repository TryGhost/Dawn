const { getStripe } = require("../utils/get-stripe");

const cancelStripeSubscription = (subscriptionId) => {
  const stripe = getStripe();
  return stripe.subscriptions.del(subscriptionId);
};

module.exports = { cancelStripeSubscription };
