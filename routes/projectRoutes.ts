const { createProject } = require("./../controllers/projectControllers");

const projectsRouter = require("express").Router();

projectsRouter.route("/").get().post(createProject);

projectsRouter.route("/:id").get().patch().delete();

module.exports = projectsRouter;
