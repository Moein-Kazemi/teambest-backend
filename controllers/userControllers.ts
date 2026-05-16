import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../interfaces/userDocument";
import { User } from "../models/userModel";
import ApiFeatures from "../utils/classes/ApiFeatures";
const catchAsyncFn = require("./../utils/catchAsyncFn");

//✅
exports.getAllUsers = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures<UserDocument>(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagenate();

    const users = await features.query;

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  },
);

exports.createUser = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      status: "Error",
      message: "This route dose not define in the server.",
    });
  },
);
exports.getUser = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      status: "Error",
      message: "This route dose not define in the server.",
    });
  },
);
exports.updataUser = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      status: "Error",
      message: "This route dose not define in the server.",
    });
  },
);
exports.deleteUser = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
      status: "Error",
      message: "This route dose not define in the server.",
    });
  },
);
