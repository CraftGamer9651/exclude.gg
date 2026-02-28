// src/services/cartService.js
// Session cart that returns cents fields expected by public/js/cartPanel.js:
// { items: [{ productId, qty, name, lineTotalCents }], totalCents, itemCount }

const productsService = require("./productsService.js");

function ensureCart(req) {
  if (!req.session) throw new Error("Session middleware not configured.");
  if (!req.session.cart) req.session.cart = { items: [] };
  return req.session.cart;
}

function normalizeQty(qty) {
  const q = Number(qty);
  if (!Number.isFinite(q) || q <= 0) return 1;
  return Math.floor(q);
}

async function buildCartView(req) {
  const cart = ensureCart(req);

  let totalCents = 0;
  let itemCount = 0;
  const items = [];

  for (const line of cart.items) {
    const qty = normalizeQty(line.qty);

    // productId should be numeric id
    const product = await productsService.getById(String(line.productId));
    if (!product) continue;

    const priceCents = Math.round(Number(product.price) * 100);
    const lineTotalCents = priceCents * qty;

    totalCents += lineTotalCents;
    itemCount += qty;

    items.push({
      productId: String(line.productId),
      qty,
      name: product.name,
      lineTotalCents,
    });
  }

  return { items, totalCents, itemCount };
}

async function addItem(req, { productId, qty }) {
  if (!productId) throw new Error("Missing productId.");
  const cart = ensureCart(req);

  const q = normalizeQty(qty);
  const existing = cart.items.find(x => String(x.productId) === String(productId));

  if (existing) existing.qty = normalizeQty(existing.qty) + q;
  else cart.items.push({ productId: String(productId), qty: q });

  return buildCartView(req);
}

async function updateItem(req, { productId, qty }) {
  if (!productId) throw new Error("Missing productId.");
  const cart = ensureCart(req);

  const line = cart.items.find(x => String(x.productId) === String(productId));
  if (!line) return buildCartView(req);

  const q = Number(qty);
  if (!Number.isFinite(q) || q <= 0) {
    cart.items = cart.items.filter(x => String(x.productId) !== String(productId));
    return buildCartView(req);
  }

  line.qty = Math.floor(q);
  return buildCartView(req);
}

async function removeItem(req, { productId }) {
  if (!productId) throw new Error("Missing productId.");
  const cart = ensureCart(req);
  cart.items = cart.items.filter(x => String(x.productId) !== String(productId));
  return buildCartView(req);
}

async function clearCart(req) {
  if (!req.session) throw new Error("Session middleware not configured.");
  req.session.cart = { items: [] };
  return buildCartView(req);
}

module.exports = { buildCartView, addItem, updateItem, removeItem, clearCart };