const notesRouter = require("express").Router();

notesRouter.route("/").get().post();

notesRouter.route("/:id").get().patch().delete();

module.exports = notesRouter;
