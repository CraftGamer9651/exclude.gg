const express = require("express");
const path = require("path");

const app = express();

// body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, "public")));

// views (EJS)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// routes
const pageRoutes = require("./src/routes/pages");
app.use("/", pageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));