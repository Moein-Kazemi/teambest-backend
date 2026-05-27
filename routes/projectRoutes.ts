const {
  getAllProject,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require("./../controllers/projectControllers");
const {
  checkProtectedRoute,
  restricTo,
} = require("./../controllers/authControllers");

const projectsRouter = require("express").Router();

projectsRouter
  .route("/")
  .get(
    //   checkProtectedRoute,
    //  restricTo("member", "manager"),
    getAllProject,
  )
  .post(checkProtectedRoute, restricTo("manager"), createProject);

projectsRouter
  .route("/:id")
  .get(
    // checkProtectedRoute,
    //  restricTo("member", "manager"),
    getProject,
  )
  .patch(
    // checkProtectedRoute,
    //  restricTo("manager"),
    updateProject,
  )
  .delete(
    // checkProtectedRoute,
    //  restricTo("manager"),
    deleteProject,
  );

module.exports = projectsRouter;
