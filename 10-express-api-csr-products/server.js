const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let nextId = 4;
let products = [
  { id: 1, name: "Bluetooth Headphones", price: 2999, rating: 4.5 },
  { id: 2, name: "Smart Fitness Band", price: 1899, rating: 4.3 },
  { id: 3, name: "Laptop Cooling Pad", price: 999, rating: 4.1 }
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  const { name, price, rating } = req.body;
  if (!name || price === undefined || rating === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const item = {
    id: nextId++,
    name: name,
    price: Number(price),
    rating: Number(rating)
  };
  products.push(item);
  res.status(201).json(item);
});

app.delete("/api/products/:id", (req, res) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log("API + CSR server running on port " + PORT);
});
