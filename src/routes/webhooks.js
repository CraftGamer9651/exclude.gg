const express = require("express");
const router = express.Router();
const { stripe } = require("../services/stripeService");

// Stripe needs raw body to verify signature
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error`);
    }

    // Payment completed
    if (event.type === "checkout.session.completed") {
      // TODO: store order in DB later
      // For v1: clear cart
      // NOTE: sessions are not directly available here in raw webhook route
      // We'll clear cart client-side on success=1, or later tie order to a user.
    }

    res.json({ received: true });
  }
);

module.exports = router;
