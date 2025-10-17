const express = require("express");
const Router = express.Router();

const {
  getAllavailability,
  addAvailability,
  removeAvailability,
} = require("../services/availabilityServices");

const AuthService = require("../services/authServices");

Router.use(AuthService.Protect,AuthService.allowedTo("provider"));

Router.get("/", getAllavailability);
Router.put("/addavail", addAvailability);
Router.delete("/removeavail/:availId", removeAvailability);

module.exports = Router;
