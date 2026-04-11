const messagesRouter = require("express").Router();

messagesRouter.route("/").get().post();

messagesRouter.route("/:id").get().patch().delete();

module.exports = messagesRouter;
