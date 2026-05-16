const usersRoter = require("express").Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updataUser,
  deleteUser,
} = require("./../controllers/userControllers");
const { signup, login } = require("./../controllers/authControllers");
// ALL INFO ABOUT USER
usersRoter.route("/").get(getAllUsers).post(createUser);
usersRoter.route("/:id").get(getUser).patch(updataUser).delete(deleteUser);

// SIGN UP AND LOGIN
usersRoter.route("/signup").post(signup);
usersRoter.route("/login").post(login);

module.exports = usersRoter;
