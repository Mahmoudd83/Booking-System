const asyncHandler = require("express-async-handler");
const Appointments = require("../models/appointmentsModel");
const { sendEmail } = require("../utils/SendMail");
const { sendSMS } = require("../utils/SendSMS");

exports.createAppointment = asyncHandler(async (req, res, next) => {
  const appoint = await Appointments.create({
    userId: req.user._id,
    ...req.body,
  });
  res.status(201).json(appoint);
});

exports.userAppointments = asyncHandler(async (req, res, next) => {
  const appoint = await Appointments.find({ userId: req.user._id });
  res.status(200).json(appoint);
});

exports.providerAppointments = asyncHandler(async (req, res, next) => {
  const appoint = await Appointments.find({ providerId: req.user._id });
  res.status(200).json(appoint);
});

exports.allAppointments = asyncHandler(async (req, res, next) => {
  const appoint = await Appointments.find();
  res.status(200).json(appoint);
});

exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  const appoint = await Appointments.findByIdAndUpdate(
    req.params.id,
    {
      status: "cancelled",
    },
    { new: true }
  );
  if (!appoint) {
    return res.status(404).json({ message: "The Appointment Not Exit" });
  }

  res.status(200).json(appoint);
});

exports.confirmAppointment = asyncHandler(async (req, res, next) => {
  const status = "confirmed";
  const appoint = await Appointments.findByIdAndUpdate(
    req.params.id,
    {
      status: status,
    },
    { new: true }
  );
  if (!appoint) {
    return res.status(404).json({ message: "The Appointment Not Exit" });
  }

  const subject =
    status === "confirmed"
      ? "Your booking is confirmed"
      : "Your booking was cancelled";

  const message =
    status === "confirmed"
      ? "We’re happy to confirm your appointment!"
      : "Your appointment has been cancelled.";

      const email = appoint.userId
  await sendEmail(email, subject, `<p>${message}</p>`);
  await sendSMS(appoint.userId.phone, message);
  res.status(200).json(appoint);
});
