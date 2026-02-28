const express = require("express");
const bcrypt = require("bcrypt");
const requireStaff = require("../middleware/requireStaff");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("pages/admin", { title: "Admin Login", error: null });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // store these in .env
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;

  if (!username || !password) {
    return res.status(400).render("pages/admin", { title: "Admin Login", error: "Missing credentials." });
  }

  if (username !== ADMIN_USER) {
    return res.status(401).render("pages/admin", { title: "Admin Login", error: "Invalid login." });
  }

  const ok = await bcrypt.compare(password, ADMIN_PASS_HASH);
  if (!ok) {
    return res.status(401).render("pages/admin", { title: "Admin Login", error: "Invalid login." });
  }

  req.session.isStaff = true;
  res.redirect("/admin");
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

router.get("/", requireStaff, (req, res) => {
  res.render("pages/admin_dashboard", { title: "Admin" });
});

module.exports = router;