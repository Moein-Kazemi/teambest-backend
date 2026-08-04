const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

// CLASSES
const AppError = require("./utils/classes/AppError");

// ROUTER
const messagesRouter = require("./routes/messageRoutes");
const notesRouter = require("./routes/noteRoutes");
const projectsRouter = require("./routes/projectRoutes");
const tasksRouter = require("./routes/taskRoutes");
const teamsRouter = require("./routes/teamRoutes");
const usersRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorControllers");

// TYPE CHECKER
import { Request, Response, NextFunction } from "express";

// LOG FOR REQUEST
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CONECT TO FRONT END
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// body parser for read req.body
app.use(express.json());

// save request time
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).requestDate = new Date().toISOString();

  next();
});

/////// ROUTES
app.use("/api/v1/tasks", tasksRouter); // ✅
app.use("/api/v1/projects", projectsRouter); // proccessing...
app.use("/api/v1/users", usersRouter); // proccessing...
app.use("/api/v1/teams", teamsRouter); // ✅
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/notes", notesRouter);

// INVALID ROUTE ERROR HANDLER

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`not found the ${req.originalUrl} route!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
