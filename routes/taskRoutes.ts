const {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("./../controllers/taskControllers");
const {
  checkProtectedRoute: checkProtectedTasksRoute,
  restricTo: restricToTasks,
} = require("./../controllers/authControllers");

const tasksRouter = require("express").Router();

tasksRouter.route("/").get(getAllTasks).post(createTask);

tasksRouter.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = tasksRouter;
