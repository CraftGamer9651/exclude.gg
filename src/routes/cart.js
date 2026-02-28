const express = require("express");
const router = express.Router();
const cart = require("../controllers/cartController");

router.get("/", cart.getCart);
router.post("/add", cart.add);
router.post("/update", cart.update);
router.post("/remove", cart.remove);
router.post("/clear", cart.clear);

module.exports = router;