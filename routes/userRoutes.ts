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
  .get(getAllUsers)
  .post(checkProtectedUsersRoute, restricToUsers("manager"), createUser);
usersRoter
  .route("/:id")
  .get(getUser)
  .patch(
    checkProtectedUsersRoute,
    restricToUsers("manager", "user", "member"),
    updataUser,
  )
  .delete(checkProtectedUsersRoute, restricToUsers("manager"), deleteUser);

// SIGN UP AND LOGIN
usersRoter.route("/signup").post(signup);
usersRoter.route("/login").post(login);

module.exports = usersRoter;
