const catchAsyncFn = require("./../utils/catchAsyncFn");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/classes/AppError");
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { UserDocument } from "../interfaces/userDocument";

declare module "express" {
  interface Request {
    user?: UserDocument;
  }
}

const createToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SIGNUP LEVEL ONE
exports.signup = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) CREATE USER
    const newUser: UserDocument = await User.create({
      name: req.body.name,
      family: req.body.family,
      phone: req.body.phone,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // create token
    const token = createToken(newUser._id.toString());

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  },
);

// LOGIN
exports.login = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    const { phone, password } = req.body;

    // 1) CHECK IF THE PHONE AND PASSWORD EXIST
    if (!phone || !password) {
      return next(
        new AppError(
          "لطفا مقدار شماره تماس و رمز عبور را به درستی وارد کنید.",
          400,
        ),
      );
    }

    // 2) CHECK IF THE PHONE BELONG TO THE USER
    const user = await User.findOne({ phone }).select("+password");
    if (!user) {
      return next(
        new AppError("کاربری با این شماره تماس یا رمز عبور پیدا نشد.", 404),
      );
    }
    // 3) CHECK IF THE PASSWORD WAS CORRECT
    const correctPassword = await user.isCorrectPassword(
      password,
      user.password,
    );
    if (!user || !correctPassword) {
      return next(new AppError("شماره تماس یا رمز عبور اشتباه است.", 401));
    }

    // 4) CREATE TOKEN
    const token = createToken(user._id);

    // 5) SEND RESPONSE
    res.status(200).json({
      status: "success",
      token,
    });
  },
);
