var btn = document.getElementById("jokeBtn");
var setup = document.getElementById("setup");
var punchline = document.getElementById("punchline");
var category = document.getElementById("category");

function loadJoke() {
  btn.disabled = true;
  setup.textContent = "Loading...";
  punchline.textContent = "";

  fetch("https://v2.jokeapi.dev/joke/Programming,Misc,Pun?type=twopart&safe-mode&lang=en")
    .then(function (res) {
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    })
    .then(function (data) {
      if (data.error) throw new Error(data.message || "Could not find a joke");

      category.textContent = data.category || "general";
      setup.textContent = data.setup;
      punchline.textContent = data.delivery;
    })
    .catch(function (err) {
      setup.textContent = "Could not load joke.";
      punchline.textContent = err.message || "Check your internet connection.";
    })
    .finally(function () {
      btn.disabled = false;
    });
}

btn.addEventListener("click", loadJoke);
loadJoke();