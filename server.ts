const dotenv = require("dotenv");

// READ ENVIERMENT VARIABLE
dotenv.config({ path: "./config.env" });
const app = require("./app");

// START THE SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`the server listening on port ${port}`);
});
