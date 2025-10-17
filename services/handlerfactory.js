const asyncHandler = require("express-async-handler");

exports.createOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const data = await model.create(req.body);
    res.status(201).json({ data });
  });
};

exports.getOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const data = await model.findById(req.params.id);
    if (!data) {
      res.json(`no document for this id ${req.params.id}`);
    }
    res.status(200).json({ data });
  });
};

exports.getAll = (model) => {
  return asyncHandler(async (req, res, next) => {
    const data = await model.find();
    res.status(200).json({ data });
  });
};

exports.updateOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const data = await model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );

    if (!data) {
      res.json(`no document for this id ${req.params.id}`);
    }
    res.status(200).json({ data });
  });
};

exports.deleteOne = (model) => {
  return asyncHandler(async (req, res, next) => {
    const data = await model.findOneAndDelete({ _id: req.params.id });
    if (!data) {
      res.json(`no document for this id ${req.params.id}`);
    }
    res.status(204).json({});
  });
};
