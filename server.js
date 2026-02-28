require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();

// body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  }
}));

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// static files
app.use(express.static(path.join(__dirname, "public")));

// views (EJS)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes (ALL routes go AFTER app is created)
const pageRoutes = require("./src/routes/pages");
app.use("/", pageRoutes);

const cartRoutes = require("./src/routes/cart");
app.use("/api/cart", cartRoutes);

const checkoutRoutes = require("./src/routes/checkout");
app.use("/api/checkout", checkoutRoutes);

const orderRoutes = require("./src/routes/orders");
app.use("/api/orders", orderRoutes);

const webhookRoutes = require("./src/routes/webhooks");
app.use("/webhooks", webhookRoutes);

const adminRoutes = require("./src/routes/admin");
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));