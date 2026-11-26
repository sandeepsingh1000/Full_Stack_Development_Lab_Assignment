const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const feedbacks = [
  { name: "Rohit", rating: "5", comment: "Good routing example." }
];

// home page
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// about page
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// services page
app.get("/services", (req, res) => {
  const services = [
    "Web Design",
    "Backend APIs with Node & Express",
    "MongoDB & SQL Integration",
    "React Frontend Development"
  ];
  res.render("services", { title: "Services", services });
});

// contact form page
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact", submitted: null });
});

// handle contact form submit
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  res.render("contact", {
    title: "Contact",
    submitted: { name, email, message }
  });
});

// feedback list page
app.get("/feedback", (req, res) => {
  res.render("feedback", { title: "Feedback", feedbacks });
});

// add new feedback
app.post("/feedback", (req, res) => {
  const { name, rating, comment } = req.body;
  if (name && comment) {
    feedbacks.push({ name, rating: rating || "5", comment });
  }
  res.redirect("/feedback");
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
