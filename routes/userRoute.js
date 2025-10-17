const express = require("express");
const Router = express.Router();

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../services/usersServices");

Router.route("/").post(createUser).get(getUsers);

Router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = Router;
