const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("pages/landing", { title: "exclude.gg" });
});

router.get("/shop", (req, res) => {
  res.render("pages/shop", { title: "Shop - exclude.gg" });
});

router.get("/shop/:game", (req, res) => {
  res.render("pages/items", { title: `${req.params.game} - exclude.gg`, game: req.params.game });
});

router.get("/cart", (req, res) => {
  res.render("pages/cart", { title: "Cart - exclude.gg" });
});

router.get("/checkout", (req, res) => {
  res.render("pages/checkout", { title: "Checkout - exclude.gg" });
});

router.get("/delivery", (req, res) => {
  res.render("pages/delivery", { title: "Delivery - exclude.gg" });
});

// policy pages (clean URLs)
router.get("/tos", (req, res) => {
  res.render("pages/policy", { title: "Terms - exclude.gg", heading: "Terms of Service" });
});
router.get("/privacy-policy", (req, res) => {
  res.render("pages/policy", { title: "Privacy - exclude.gg", heading: "Privacy Policy" });
});
router.get("/refund-policy", (req, res) => {
  res.render("pages/policy", { title: "Refunds - exclude.gg", heading: "Refund Policy" });
});

module.exports = router;