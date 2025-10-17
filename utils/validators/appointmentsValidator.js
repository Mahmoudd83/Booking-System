const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatormiddelware");
const Appointment = require("../../models/appointmentsModel");

exports.CreateAppointmentValidator = [
  check("startTime")
    .notEmpty()
    .withMessage("start time is required")
    .isISO8601()
    .withMessage("invalid date format"),
  check("endTime")
    .notEmpty()
    .withMessage("end  time is required")
    .isISO8601()
    .withMessage("invalid date format")
    .custom((val, { req }) => {
      if (new Date(val) <= new Date(req.body.startTime)) {
        throw new Error("End time must be after start time ");
      }
      return true;
    }),

  check("startTime").custom(async (startTime, { req }) => {
    const { providerId, endTime } = req.body;

    const conflict = await Appointment.findOne({
      providerId,
      status: { $ne: "cancelled" },
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) },
        },
      ],
    });

    if (conflict) {
      throw new Error("the time is booked");
    }
    return true;
  }),
  validatorMiddleware,
];
