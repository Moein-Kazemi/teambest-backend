const dotenv = require("dotenv");
const mongoose = require("mongoose");

// TYPE CHECKER
import { ConnectOptions } from "mongoose";

// unchaght Exeption for sync code that really problem in the app
process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION : shutting down...❌");
  console.log(err.name, err.message);
  process.exit(1);
});

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
const server = app.listen(port, () => {
  console.log(`the server listening on port ${port}`);
});

// UNHANDLED REJECTION for async error like can't connect to DB
process.on("unhandledRejection", (err: Error) => {
  console.log(err.name, err.message);
  console.log("unhanded rejection : shutting down...❌");
  server.close(() => {
    process.exit(1);
  });
});
