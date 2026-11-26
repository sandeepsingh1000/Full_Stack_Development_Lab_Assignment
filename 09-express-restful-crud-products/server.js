const express = require("express");
const methodOverride = require("method-override");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let nextId = 4;
let products = [
  { id: 1, name: "Mechanical Keyboard", price: 2499, description: "Backlit tactile keyboard for coding and gaming." },
  { id: 2, name: "Wireless Mouse", price: 799, description: "2.4GHz optical wireless mouse." },
  { id: 3, name: "USB-C Hub", price: 1299, description: "Multiport USB-C adapter with HDMI and USB 3.0." }
];

app.get("/", (req, res) => {
  res.redirect("/products");
});

app.get("/products", (req, res) => {
  res.render("index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("new");
});

app.post("/products", (req, res) => {
  products.push({
    id: nextId++,
    name: req.body.name,
    price: Number(req.body.price),
    description: req.body.description
  });
  res.redirect("/products");
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.render("show", { product });
});

app.get("/products/:id/edit", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  res.render("edit", { product });
});

app.put("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) return res.status(404).send("Product not found");
  product.name = req.body.name;
  product.price = Number(req.body.price);
  product.description = req.body.description;
  res.redirect("/products");
});

app.delete("/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.redirect("/products");
});

app.listen(PORT, () => {
  console.log("CRUD server running on port " + PORT);
});
