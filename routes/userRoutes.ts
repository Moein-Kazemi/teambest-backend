const usersRoter = require("express").Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updataUser,
  deleteUser,
} = require("./../controllers/userControllers");
const { signup, login } = require("./../controllers/authControllers");
const {
  checkProtectedRoute: checkProtectedUsersRoute,
  restricTo: restricToUsers,
} = require("./../controllers/authControllers");

// ALL INFO ABOUT USER
usersRoter
  .route("/")
  .get(checkProtectedUsersRoute, restricToUsers("manager"), getAllUsers)
  .post(checkProtectedUsersRoute, restricToUsers("manager"), createUser);
usersRoter
  .route("/:id")
  .get(checkProtectedUsersRoute, restricToUsers("manager"), getUser)
  .patch(checkProtectedUsersRoute, restricToUsers("manager"), updataUser)
  .delete(checkProtectedUsersRoute, restricToUsers("manager"), deleteUser);

// SIGN UP AND LOGIN
usersRoter.route("/signup").post(signup);
usersRoter.route("/login").post(login);

module.exports = usersRoter;
