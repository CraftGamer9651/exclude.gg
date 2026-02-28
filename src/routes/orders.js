const express = require("express");
const router = express.Router();
const { finalizeOrder } = require("../controllers/ordersController");

router.post("/finalize", finalizeOrder);

module.exports = router;
