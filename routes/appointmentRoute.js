const express = require("express");
const Router = express.Router();

const {
  createAppointment,
  userAppointments,
  allAppointments,
  providerAppointments,
  cancelAppointment,
  confirmAppointment,
} = require("../services/appointmentServices");

const {
  CreateAppointmentValidator,
} = require("../utils/validators/appointmentsValidator");

const AuthService = require("../services/authServices");

Router.use(AuthService.Protect);

Router.post(
  "/",
  AuthService.allowedTo("user"),
  CreateAppointmentValidator,
  createAppointment
);

Router.get("/my", AuthService.allowedTo("user"), userAppointments);

Router.get(
  "/provider",
  AuthService.allowedTo("provider"),
  providerAppointments
);

Router.get("/all", AuthService.allowedTo("admin"), allAppointments);
Router.put(
  "/:id/cancel",
  AuthService.allowedTo("user", "provider"),
  cancelAppointment
);

Router.put(
  "/:id/confirm",
  AuthService.allowedTo("provider"),
  confirmAppointment
);

module.exports = Router;
