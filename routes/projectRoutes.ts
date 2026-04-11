const projectsRouter = require("express").Router();

projectsRouter.route("/").get().post();

projectsRouter.route("/:id").get().patch().delete();

module.exports = projectsRouter;
