const catchAsyncFn = require("./../utils/catchAsyncFn");
const Team = require("./../models/teamModel");
const TeamSyncService = require("./../services/TeamSyncService");

import { Request, Response, NextFunction } from "express";
import { TeamDocument } from "../interfaces/teamDocument";
import ApiFeatures from "../utils/classes/ApiFeatures";

//✅
exports.getAllTeams = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures<TeamDocument>(Team.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenate();

    const teams = await features.query;

    res.status(200).json({
      status: "success",
      results: teams.length,
      data: {
        teams,
      },
    });
  },
);

// ✅
exports.createTeam = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const newTeam = await TeamSyncService.createTeamAndSync(
      {
        name: req.body.name,
        summary: req.body.summary,
        logo: req?.body?.logo || "",
        ownerId: req.body.ownerId,
        members: req.body.members,
      },
      req.body.members,
      next,
    );

    res.status(201).json({
      message: "success",
      data: {
        team: newTeam,
      },
    });
  },
);

// ✅
exports.getTeam = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const team = await Team.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        team,
      },
    });
  },
);

// ✅
exports.updateTeam = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    let updateTeam: TeamDocument;

    if (typeof req.params.id === "string") {
      updateTeam = await TeamSyncService.updateTeamAndSync(
        req.params.id,
        req.body,
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        team: updateTeam,
      },
    });
  },
);

// ✅
exports.deleteTeam = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleteTeam = await TeamSyncService.deleteTeam(
      req.params.id.toString(),
      next,
    );
    if (!deleteTeam) {
      return next(new AppError("پروسه حذف تیم انجام نشد.", 400));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);
