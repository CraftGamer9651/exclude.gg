const { stripe } = require("../services/stripeService");
const cartService = require("../services/cartService");

// v1: store orders in memory (restart wipes). Later: Postgres.
const ORDERS = [];

async function finalizeOrder(req, res) {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Missing sessionId" });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Not paid" });
    }

    const cart = cartService.buildCartView(req);

    const order = {
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      stripeSessionId: sessionId,
      amountTotalCents: session.amount_total ?? cart.totalCents,
      items: cart.items,
      email: session.customer_details?.email || null,
    };

    ORDERS.push(order);

    // Clear cart after saving order
    cartService.clearCart(req);

    return res.json({ ok: true, order });
  } catch (e) {
    return res.status(500).json({ error: "Failed to finalize order" });
  }
}

module.exports = { finalizeOrder, ORDERS };
