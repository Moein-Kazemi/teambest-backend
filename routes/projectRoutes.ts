const {
  getAllProject,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} = require("./../controllers/projectControllers");

const projectsRouter = require("express").Router();

projectsRouter.route("/").get(getAllProject).post(createProject);

projectsRouter
  .route("/:id")
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject);

module.exports = projectsRouter;
