const express = require("express");
const passport = require("passport");
const createToken = require("../utils/createToken");
const Router = express.Router();
require("dotenv").config({ path: "config.env" });

const { SignUp, LogIn, GoogleCallback } = require("../services/authServices");

Router.post("/signup", SignUp);
Router.post("/login", LogIn);

// with session
Router.get(
  "/gogle",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

Router.get(
  "/goo/call",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = createToken(req.user._id);
    res.json({ token, user: req.user });
  }
);

Router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// with jwt

Router.get("/google", (req, res) => {
  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=profile email`;
    console.log(url);
  res.redirect(url);
});

Router.get("/google/callback", GoogleCallback);

module.exports = Router;
