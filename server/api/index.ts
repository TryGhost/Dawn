const express = require("express");
const {
  getStripeCheckoutSession,
} = require("./controllers/get-stripe-checkout-session");
const port = 3004;
const cors = require("cors");
const { createStripePrice } = require("./controllers/create-stripe-price");
const {
  cancelStripeSubscription,
} = require("./controllers/cancel-stripe-subscription");

const server = express();

server.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
server.use(cors());

server.use(express.json());

//
// ROUTES
//

server.get("/api/test", (req, res) => {
  console.log('Received request...')
  res.send({ it: "works!" });
});

// Get stripe session
server.post("/api/get-stripe-session", async (req, res) => {
  const amount = req.body.amount * 100; // price is sent in cents to stripe

  if (!amount) {
    return res.status(403).send({ message: "Missing field in body: amount" });
  }
  const price = await createStripePrice(amount);
  const stripeSession = await getStripeCheckoutSession(req.body.email, price.id);
  return res.send({ url: stripeSession.url });
});

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on PORT: ${port}`);
});

module.exports = server;
