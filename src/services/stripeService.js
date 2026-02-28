// src/services/stripeService.js
// Temporary stub so the server boots without Stripe configured.
// Replace with real Stripe integration when ready.

function notConfigured() {
  throw new Error("Stripe is not configured yet.");
}

// Common helper names (we'll adjust once we see checkoutController.js)
async function createCheckoutSession() {
  return notConfigured();
}

async function createPaymentIntent() {
  return notConfigured();
}

async function verifyWebhook() {
  return notConfigured();
}

module.exports = {
  createCheckoutSession,
  createPaymentIntent,
  verifyWebhook,
};