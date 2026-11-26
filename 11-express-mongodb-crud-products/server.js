require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fsd_products";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

app.get("/", (req, res) => res.redirect("/products"));

app.get("/products", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render("index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("new");
});

app.post("/products", async (req, res) => {
  await Product.create({
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category || "General",
    description: req.body.description
  });
  res.redirect("/products");
});

app.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("edit", { product });
});

app.put("/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category || "General",
    description: req.body.description
  });
  res.redirect("/products");
});

app.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
