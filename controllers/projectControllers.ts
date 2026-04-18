const catchAsyncFn = require("./../utils/catchAsyncFn");
const Project = require("./../models/projectModel");

// TYPE CHECKER
import { Request, Response, NextFunction } from "express";

exports.createProject = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    console.log(body);
    const newProject = await Project.create(req.body);

    res.status(201).json({
      message: "success",
      data: {
        project: newProject,
      },
    });
    // const newTask = await TaskSyncService.createTaskAndUpdateProject();
  },
);
