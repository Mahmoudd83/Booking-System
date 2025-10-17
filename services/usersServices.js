const User = require("../models/usersModel");
const factory = require("./handlerfactory.js");

exports.createUser = factory.createOne(User);

exports.getUser = factory.getOne(User);

exports.getUsers = factory.getAll(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
