const catchAsyncFn = require("./../utils/catchAsyncFn");
const User = require("./../models/userModel");

import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../interfaces/userDocument";
import ApiFeatures from "../utils/classes/ApiFeatures";

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
    console.log(req.headers);
    let user;
    if (typeof req.params.id === "string") {
      user = await User.findById(req.params.id);
    } else {
      next(new AppError("آیدی وارد شده معتبر نیست.", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  },
);
exports.updataUser = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    let user;
    if (typeof req.params.id === "string") {
      user = await User.findByIdAndUpdate(req.params.id, req.body);
    } else {
      next(new AppError("آیدی وارد شده معتبر نیست.", 400));
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
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
