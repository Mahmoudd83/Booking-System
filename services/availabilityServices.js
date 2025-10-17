const asyncHandler = require("express-async-handler");
const Service = require("../models/servicesModel");

exports.addAvailability = asyncHandler(async (req, res, next) => {
  const service = await Service.findOneAndUpdate(
    { providerId: req.user._id },
    {
      $addToSet: { availability: req.body },
    },
    { new: true }
  );
  if (!service) {
    return res
      .status(404)
      .json({ message: "No service found for this provider" });
  }

  res.status(200).json({ data: service.availability });
});

exports.removeAvailability = asyncHandler(async (req, res, next) => {
  const service = await Service.findOneAndUpdate(
    { providerId: req.user._id },
    {
      $pull: { availability: { _id: req.params.availId } },
    },
    { new: true }
  );

  if (!service) {
    return res
      .status(404)
      .json({ message: "No service found for this provider" });
  }

  res.status(200).json({ data: service.availability });
});

exports.getAllavailability = asyncHandler(async (req, res, next) => {
  const service = await Service.findOne({ providerId: req.user._id });

  if (!service) {
    return res.status(404).json({ message: "no document for this id" });
  }
  res.status(200).json({
    result: service.availability.length,
    data: service.availability,
  });
});
