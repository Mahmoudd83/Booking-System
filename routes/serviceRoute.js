const express = require("express");
const Router = express.Router();

const {
  createService,
  getService,
  getServices,
  updateService,
  deleteService,
  getMyService,
} = require("../services/servicesServices");

const {
  UpdateServiceValidtor,
  DeleteServiceValidtor,
} = require("../utils/validators/servicesValildator");
const AuthService = require("../services/authServices");

Router.get(
  "/myServices",
  AuthService.Protect,
  AuthService.allowedTo("provider"),
  getMyService
);
Router.route("/")
  .post(AuthService.Protect, AuthService.allowedTo("provider"), createService)
  .get(getServices);

Router.route("/:id")
  .get(getService)
  .put(
    AuthService.Protect,
    AuthService.allowedTo("provider"),
    UpdateServiceValidtor,
    updateService
  )
  .delete(
    AuthService.Protect,
    AuthService.allowedTo("provider", "admin"),
    DeleteServiceValidtor,
    deleteService
  );

module.exports = Router;
