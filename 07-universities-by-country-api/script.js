var form = document.getElementById("searchForm");
var input = document.getElementById("countryInput");
var statusText = document.getElementById("status");
var tableBody = document.getElementById("tableBody");

var API_BASE = "http://universities.hipolabs.com/search";
var HTTPS_FALLBACK = "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json";

async function fetchFromHipolabs(query) {
  var res = await fetch(API_BASE + "?country=" + encodeURIComponent(query));
  if (!res.ok) throw new Error("HTTP " + res.status);
  var list = await res.json();

  if (list.length === 0) {
    res = await fetch(API_BASE + "?name=" + encodeURIComponent(query));
    if (!res.ok) throw new Error("HTTP " + res.status);
    list = await res.json();
  }
  return list;
}

async function fetchFromFallback(query) {
  var res = await fetch(HTTPS_FALLBACK);
  if (!res.ok) throw new Error("Fallback failed");
  var all = await res.json();
  var q = query.toLowerCase();

  var byCountry = all.filter(function (u) {
    return (u.country || "").toLowerCase() === q;
  });
  if (byCountry.length > 0) return byCountry;

  return all.filter(function (u) {
    return (u.name || "").toLowerCase().indexOf(q) !== -1;
  });
}

async function getUniversities(query) {
  statusText.textContent = "Searching...";
  tableBody.innerHTML = "";

  try {
    var list;
    try {
      list = await fetchFromHipolabs(query);
    } catch (e) {
      list = await fetchFromFallback(query);
    }

    if (list.length === 0) {
      statusText.textContent = "No universities found for \"" + query + "\"";
      return;
    }

    statusText.textContent = "Found " + list.length + " universities for \"" + query + "\"";

    for (var i = 0; i < list.length; i++) {
      var u = list[i];
      var tr = document.createElement("tr");
      var site = u.web_pages && u.web_pages.length ? u.web_pages[0] : "";
      var state = u["state-province"] || u.country || "N/A";

      tr.innerHTML =
        "<td>" + (i + 1) + "</td>" +
        "<td>" + u.name + "</td>" +
        "<td>" + state + "</td>" +
        "<td>" + (site ? '<a href="' + site + '" target="_blank">' + site + "</a>" : "N/A") + "</td>";

      tableBody.appendChild(tr);
    }
  } catch (err) {
    statusText.textContent = "Error: " + err.message;
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var q = input.value.trim();
  if (q) getUniversities(q);
});

getUniversities("India");