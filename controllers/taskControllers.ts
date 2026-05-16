const catchAsyncFn = require("./../utils/catchAsyncFn");
const Task = require("./../models/taskModel");
const AppError = require("./../utils/classes/AppError");
const TaskSyncService = require("./../services/TaskSyncService");

import { Request, Response, NextFunction } from "express";
import { TaskDocument } from "../interfaces/taskDocument";
import ApiFeatures from "../utils/classes/ApiFeatures";

exports.getAllTasks = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures<TaskDocument>(Task.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenate();

    const tasks = await features.query;

    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: {
        tasks,
      },
    });
  },
);

exports.getTask = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new AppError("Not found task with taht id.", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  },
);

exports.createTask = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTask = await TaskSyncService.createTaskAndSync(
      req.body.projectId,
      req.body.stageId,
      req.body,
      next,
    );
    res.status(201).json({
      message: "success",
      data: {
        task: newTask,
      },
    });
  },
);

exports.updateTask = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    let updateTask;
    if (typeof req.params.id === "string") {
      updateTask = await TaskSyncService.updateTaskAndSync(
        req.params.id,
        req.body,
        next,
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        task: updateTask,
      },
    });
  },
);

exports.deleteTask = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    let deleteTask: TaskDocument | void;
    if (typeof req.params.id === "string") {
      deleteTask = await TaskSyncService.deleteTaskAndSync(req.params.id, next);
    }

    if (!deleteTask) {
      return next(new AppError("can't find Task with that Id.", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
