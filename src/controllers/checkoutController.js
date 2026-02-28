const { stripe } = require("../services/stripeService");
const cartService = require("../services/cartService");

async function createSession(req, res) {
  try {
    const cart = cartService.buildCartView(req);
    if (!cart.items.length) return res.status(400).json({ error: "Cart is empty" });

    const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: cart.items.map((i) => ({
        price_data: {
          currency: "usd",
          product_data: { name: i.name },
          unit_amount: i.priceCents,
        },
        quantity: i.qty,
      })),
      success_url: `${baseUrl}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=1`,
      metadata: {
        cartItemCount: String(cart.itemCount),
      },
    });

    return res.json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: "Failed to create Stripe session" });
  }
}

module.exports = { createSession };
