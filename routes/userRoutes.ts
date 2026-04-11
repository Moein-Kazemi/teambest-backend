const usersRoter = require("express").Router();

usersRoter.route("/").get().post();

usersRoter.route("/:id").get().patch().delete();

module.exports = usersRoter;
