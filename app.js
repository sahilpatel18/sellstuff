const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const path = require("path");

const PORT = 3000;
const VIEWS_PATH = path.join(__dirname, "/views");

app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(PORT, () => {
  console.log("server is running");
});
