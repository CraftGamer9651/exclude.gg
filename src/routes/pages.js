const express = require("express");
const router = express.Router();
const productsService = require("../services/productsService.js");

router.get("/", async (req, res, next) => {
  try {
    const featured = await productsService.getFeatured(4);
    res.render("layout", {
      title: "exclude.gg",
      page: "pages/landing",
      css: ["/css/pages/landing.css"],
      scripts: ["/js/landing.js"],
      featured
});
  } catch (e) {
    next(e);
  }
});

router.get("/shop", async (req, res, next) => {
  try {
    const items = await productsService.getAll();
    res.render("layout", {
      title: "Shop",
      page: "pages/shop",
      css: ["/css/pages/shop.css"],
      scripts: ["/js/cartPanel.js"],
      items
    });
  } catch (e) {
    next(e);
  }
});

router.get("/item/:slug", async (req, res, next) => {
  try {
    const item = await productsService.getBySlug(req.params.slug);
    if (!item) return res.status(404).render("pages/policy", { title: "Not found" });
    res.render("layout", {
  title: item.name,
  page: "pages/items",
  css: ["/css/pages/landing.css"], // optional: reuse styling for now
  scripts: ["/js/cartPanel.js"],
  item
});
  } catch (e) {
    next(e);
  }
});

router.get("/delivery", (req, res) => {
  res.render("layout", { title: "Delivery", page: "pages/delivery", css: [], scripts: [] });
});

router.get("/tos", (req, res) => {
  res.render("layout", { title: "Terms", page: "pages/tos", css: [], scripts: [] });
});

router.get("/privacy-policy", (req, res) => {
  res.render("layout", { title: "Privacy", page: "pages/privacy", css: [], scripts: [] });
});

router.get("/refund-policy", (req, res) => {
  res.render("layout", { title: "Refunds", page: "pages/refunds", css: [], scripts: [] });
});

module.exports = router;