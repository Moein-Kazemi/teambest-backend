const catchAsyncFn = require("./../utils/catchAsyncFn");
const Task = require("./../models/taskModel");
const AppError = require("./../utils/classes/AppError");

import { Request, Response, NextFunction } from "express";

exports.getAllTasks = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await Task.find();

    res.status(200).json({
      status: "success",
      resluts: tasks.length,
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
    const newTask = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });

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
    const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return next(new AppError("can't find Task with that Id.", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
