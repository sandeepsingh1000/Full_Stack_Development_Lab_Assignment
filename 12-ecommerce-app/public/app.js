var products = [];
var cart = [];

function showTab(id) {
  document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
  document.getElementById(id).classList.add("active");
  if (id === "orders") loadOrders();
}

async function loadProducts() {
  var res = await fetch("/api/products");
  products = await res.json();
  renderStore();
  renderSeller();
}

function renderStore() {
  var grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  products.forEach(function (p) {
    var div = document.createElement("div");
    div.className = "card";
    div.innerHTML =
      "<h4>" + p.name + "</h4>" +
      "<small>" + p.category + "</small>" +
      "<p>" + p.description + "</p>" +
      "<strong>Rs. " + p.price + "</strong> (Stock: " + p.stock + ")<br>" +
      '<button onclick="addToCart(' + p.id + ')">Add to Cart</button>';
    grid.appendChild(div);
  });
}

function addToCart(id) {
  var p = products.find(function (x) { return x.id === id; });
  if (!p || p.stock <= 0) return alert("Out of stock");

  var existing = cart.find(function (c) { return c.id === id; });
  if (existing) existing.qty++;
  else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });

  renderCart();
}

function renderCart() {
  var list = document.getElementById("cartList");
  var total = 0;
  var count = 0;
  list.innerHTML = "";

  cart.forEach(function (item, idx) {
    total += item.price * item.qty;
    count += item.qty;
    var row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML =
      "<span>" + item.name + " x " + item.qty + " (Rs. " + (item.price * item.qty) + ")</span>" +
      '<button onclick="removeCart(' + idx + ')">Remove</button>';
    list.appendChild(row);
  });

  document.getElementById("cartTotal").textContent = total;
  document.getElementById("cartCount").textContent = count;
}

function removeCart(idx) {
  cart.splice(idx, 1);
  renderCart();
}

document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  if (cart.length === 0) return alert("Cart is empty");

  var res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customerName: document.getElementById("custName").value,
      paymentMethod: document.getElementById("payMethod").value,
      items: cart
    })
  });

  if (res.ok) {
    cart = [];
    renderCart();
    e.target.reset();
    await loadProducts();
    showTab("orders");
  } else {
    var err = await res.json();
    alert(err.error);
  }
});

async function loadOrders() {
  var res = await fetch("/api/orders");
  var orders = await res.json();
  var list = document.getElementById("ordersList");
  list.innerHTML = "";

  orders.forEach(function (o) {
    var div = document.createElement("div");
    div.className = "order-box";
    div.innerHTML =
      "<div><strong>Order #" + o.id + "</strong> - " + o.customerName + " (" + o.paymentMethod + ")<br>" +
      "<small>TXN: " + o.transactionId + " | Status: " + o.status + "</small></div>" +
      "<strong>Rs. " + o.total + "</strong>";
    list.appendChild(div);
  });
}

function renderSeller() {
  var body = document.getElementById("sellerBody");
  body.innerHTML = "";
  products.forEach(function (p) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + p.id + "</td>" +
      "<td>" + p.name + "</td>" +
      "<td>Rs. " + p.price + "</td>" +
      "<td>" + p.stock + "</td>" +
      '<td><button onclick="editProd(' + p.id + ')">Edit</button> <button onclick="delProd(' + p.id + ')">Delete</button></td>';
    body.appendChild(tr);
  });
}

function editProd(id) {
  var p = products.find(function (x) { return x.id === id; });
  document.getElementById("editId").value = p.id;
  document.getElementById("sName").value = p.name;
  document.getElementById("sCat").value = p.category;
  document.getElementById("sPrice").value = p.price;
  document.getElementById("sStock").value = p.stock;
  document.getElementById("sDesc").value = p.description;
}

async function delProd(id) {
  await fetch("/api/products/" + id, { method: "DELETE" });
  loadProducts();
}

document.getElementById("sellerForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  var editId = document.getElementById("editId").value;
  var payload = {
    name: document.getElementById("sName").value,
    category: document.getElementById("sCat").value,
    price: document.getElementById("sPrice").value,
    stock: document.getElementById("sStock").value,
    description: document.getElementById("sDesc").value
  };

  if (editId) {
    await fetch("/api/products/" + editId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
  document.getElementById("editId").value = "";
  e.target.reset();
  loadProducts();
});

loadProducts();
