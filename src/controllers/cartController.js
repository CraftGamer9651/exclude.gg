const cartService = require("../services/cartService");

async function getCart(req, res) {
  return res.json(await cartService.buildCartView(req));
}

async function add(req, res) {
  try {
    const { productId, qty } = req.body;
    const cart = await cartService.addItem(req, { productId, qty });
    return res.json(cart);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const { productId, qty } = req.body;
    const cart = await cartService.updateItem(req, { productId, qty });
    return res.json(cart);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    const { productId } = req.body;
    const cart = await cartService.removeItem(req, { productId });
    return res.json(cart);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function clear(req, res) {
  return res.json(await cartService.clearCart(req));
}

module.exports = { getCart, add, update, remove, clear };