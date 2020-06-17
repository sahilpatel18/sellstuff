const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const path = require("path");
const models = require("./models");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;
const PORT = 3000;
const VIEWS_PATH = path.join(__dirname, "/views");

app.use(bodyParser.urlencoded({ extended: false }));

app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  //first we need to find the user attempting to login

  let user = await models.User.findOne({
    where: {
      username: username,
    },
  });

  if (user != null) {
    bcrypt.compare(password, user.password, (error, result) => {
      if (result) {
        if (req.session) {
          req.session.user = { userId: user.id };
          res.redirect("/users/products");
        }
      } else {
        res.render("login", { message: "incorrect username or password" });
      }
    });
  } else {
    res.render("Login", { mesage: "incorrect User Name or password" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let persistedUser = await models.User.findOne({
    where: {
      username: username,
    },
  });

  if (persistedUser == null) {
    bcrypt.hash(password, SALT_ROUNDS, async (error, hash) => {
      if (error) {
        res.render("/register", { message: "Error creating user" });
      } else {
        let user = models.User.build({
          username: username,
          password: hash,
        });

        let savedUser = await user.save();
        if (savedUser != null) {
          res.redirect("/login");
        } else {
          res.render("/register", { message: "User already exists!" });
        }
      }
    });
  } else {
    res.render("/register", { message: "User already exists!" });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.listen(PORT, () => {
  console.log("server is running");
});
