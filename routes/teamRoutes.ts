const teamsRouter = require("express").Router();

teamsRouter.route("/").get().post();

teamsRouter.route("/:id").get().patch().delete();

module.exports = teamsRouter;
