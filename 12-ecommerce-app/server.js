const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const STORE_FILE = path.join(__dirname, "data", "store.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getStore() {
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
}

function saveStore(data) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/products", (req, res) => {
  res.json(getStore().products);
});

app.post("/api/products", (req, res) => {
  const { name, category, price, stock, description } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required" });
  }
  const store = getStore();
  const product = {
    id: store.nextProductId++,
    name: name,
    category: category || "General",
    price: Number(price),
    stock: Number(stock || 10),
    description: description || ""
  };
  store.products.push(product);
  saveStore(store);
  res.status(201).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const store = getStore();
  const item = store.products.find((p) => p.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Not found" });

  item.name = req.body.name || item.name;
  item.category = req.body.category || item.category;
  if (req.body.price !== undefined) item.price = Number(req.body.price);
  if (req.body.stock !== undefined) item.stock = Number(req.body.stock);
  if (req.body.description !== undefined) item.description = req.body.description;

  saveStore(store);
  res.json(item);
});

app.delete("/api/products/:id", (req, res) => {
  const store = getStore();
  store.products = store.products.filter((p) => p.id !== Number(req.params.id));
  saveStore(store);
  res.json({ ok: true });
});

app.get("/api/orders", (req, res) => {
  res.json(getStore().orders);
});

app.post("/api/orders", (req, res) => {
  const { customerName, paymentMethod, items } = req.body;
  if (!customerName || !items || items.length === 0) {
    return res.status(400).json({ error: "Customer name and cart items required" });
  }

  const store = getStore();
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    const prod = store.products.find((p) => p.id === Number(items[i].id));
    if (!prod || prod.stock < items[i].qty) {
      return res.status(400).json({ error: "Item out of stock" });
    }
    prod.stock -= items[i].qty;
    total += prod.price * items[i].qty;
  }

  const order = {
    id: store.nextOrderId++,
    customerName: customerName,
    paymentMethod: paymentMethod || "UPI",
    transactionId: "TXN" + Date.now().toString().slice(-6),
    items: items,
    total: total,
    status: "Confirmed",
    createdAt: new Date().toISOString()
  };

  store.orders.unshift(order);
  saveStore(store);
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log("Ecommerce app running on http://localhost:" + PORT);
});
