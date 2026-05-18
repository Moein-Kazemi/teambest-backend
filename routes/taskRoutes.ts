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

tasksRouter
  .route("/")
  .get(
    // checkProtectedTasksRoute,
    // restricToTasks("member", "manager"),
    getAllTasks,
  )
  .post(
    // checkProtectedTasksRoute,
    //  restricToTasks("manager"),
    createTask,
  );

tasksRouter
  .route("/:id")
  .get(
    // checkProtectedTasksRoute,
    //  restricToTasks("member", "manager"),
    getTask,
  )
  .patch(
    // checkProtectedTasksRoute,
    //  restricToTasks("manager"),
    updateTask,
  )
  .delete(
    // checkProtectedTasksRoute,
    //  restricToTasks("manager"),
    deleteTask,
  );

module.exports = tasksRouter;
