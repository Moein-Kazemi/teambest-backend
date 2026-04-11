const dotenv = require("dotenv");
const mongoose = require("mongoose");

// TYPE CHECKER
import { ConnectOptions } from "mongoose";

// READ ENVIERMENT VARIABLE
dotenv.config({ path: "./config.env" });
const app = require("./app");

// CONNECT TO MONGO DB
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con: ConnectOptions) => {
    console.log("Successfuly connect to DB");
  });

// START THE SERVER
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`the server listening on port ${port}`);
});
