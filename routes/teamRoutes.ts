const teamsRouter = require("express").Router();
const {
  getAllTeams,
  createTeam,
  getTeam,
  updateTeam,
  deleteTeam,
} = require("./../controllers/teamControllers");

teamsRouter.route("/").get(getAllTeams).post(createTeam);

teamsRouter.route("/:id").get(getTeam).patch(updateTeam).delete(deleteTeam);

module.exports = teamsRouter;
