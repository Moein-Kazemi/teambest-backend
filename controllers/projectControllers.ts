const catchAsyncFn = require("./../utils/catchAsyncFn");
const Project = require("./../models/projectModel");
const ProjectSyncService = require("./../services/ProjectSyncService");
const AppError = require("./../utils/classes/AppError");
import ApiFeatures from "../utils/classes/ApiFeatures";

// TYPE CHECKER
import { Request, Response, NextFunction } from "express";
import { ProjectDocument } from "../interfaces/projectDocument";

exports.getAllProject = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures<ProjectDocument>(Project.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenate();

    const projects = await features.query;

    res.status(200).json({
      status: "success",
      results: projects.length,
      data: {
        projects,
      },
    });
  },
);

exports.createProject = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    // CREATE PROJECT AND CREATE TASK
    const project = await ProjectSyncService.createProjectAndSync(
      req.body.projectData.teamId,
      req.body.projectData,
      req.body.tasksData,
      next,
    );

    res.status(201).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);
exports.getProject = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  },
);

exports.updateProject = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const projectData = req.body.projectData;
    const tasksData = req.body.taskData || null;
    let updateProject;

    if (typeof req.params.id === "string") {
      updateProject = await ProjectSyncService.updateProjectAndSync(
        req.params.id,
        projectData,
        tasksData,
        next,
      );
    }
    if (!updateProject) {
      next(new AppError("پروژه مورد نظر آپدیت نشد.", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        project: updateProject,
      },
    });
  },
);

exports.deleteProject = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    let deleteProject;

    if (typeof req.params.id === "string") {
      deleteProject = await ProjectSyncService.deleteProjectAndSync(
        req.params.id,
        next,
      );
    }

    if (!deleteProject) {
      return next(new AppError("پروژه مورد نظر برای حذف شدن پیدا نشد.", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
