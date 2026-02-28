const express = require("express");
const router = express.Router();
const checkout = require("../controllers/checkoutController");

router.post("/create-session", checkout.createSession);

module.exports = router;
