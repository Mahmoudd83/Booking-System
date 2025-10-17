const asyncHandler = require("express-async-handler");
const Service = require("../models/servicesModel");
const factory = require("./handlerfactory.js");

exports.createService = asyncHandler(async (req, res, next) => {
  const service = await Service.create({
    providerId: req.user._id,
    ...req.body,
  });

  res.status(201).json(service);
});

exports.getMyService = asyncHandler(async (req, res, next) => {
  const services = await Service.findOne({ providerId: req.user._id });
  res.status(200).json(services);
});
exports.getService = factory.getOne(Service);

exports.getServices = factory.getAll(Service);

exports.updateService = factory.updateOne(Service);

exports.deleteService = factory.deleteOne(Service);
