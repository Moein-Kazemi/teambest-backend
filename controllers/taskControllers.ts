import { Request, Response, NextFunction } from "express";

exports.getAllTasks = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "all Task",
  });
};
exports.createTask = (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({
    message: "created",
  });
};
exports.getTask = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "one Task",
  });
};
exports.updateTask = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: "task updated",
  });
};
exports.deleteTask = (req: Request, res: Response, next: NextFunction) => {
  res.status(204).json({
    message: "delete task",
  });
};
