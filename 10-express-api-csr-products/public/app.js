var form = document.getElementById("addForm");
var tbody = document.getElementById("tbody");

async function loadProducts() {
  var res = await fetch("/api/products");
  var data = await res.json();
  tbody.innerHTML = "";

  data.forEach(function (p) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + p.id + "</td>" +
      "<td>" + p.name + "</td>" +
      "<td>Rs. " + p.price + "</td>" +
      "<td>" + p.rating + " / 5</td>" +
      '<td><button class="del-btn" onclick="deleteProduct(' + p.id + ')">Delete</button></td>';
    tbody.appendChild(tr);
  });
}

async function deleteProduct(id) {
  await fetch("/api/products/" + id, { method: "DELETE" });
  loadProducts();
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  var body = {
    name: document.getElementById("pName").value,
    price: document.getElementById("pPrice").value,
    rating: document.getElementById("pRating").value
  };
  await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  form.reset();
  loadProducts();
});

loadProducts();
