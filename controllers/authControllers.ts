const catchAsyncFn = require("./../utils/catchAsyncFn");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/classes/AppError");
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { UserDocument } from "../interfaces/userDocument";
import { promisify } from "util";

declare module "express" {
  interface Request {
    user?: UserDocument;
  }
}
interface ITokenPayload {
  id: string;
  name: string;
  family: string;
  role: string;
  jobTitle: string;
  teamId: string;
}

const createToken = ({
  id,
  name,
  family,
  role,
  jobTitle,
  teamId,
}: ITokenPayload) => {
  return jwt.sign(
    { id, name, family, role, jobTitle, teamId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  );
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
    const token = createToken({
      id: newUser._id.toString(),
      name: newUser.name,
      family: newUser.family,
      role: newUser.role,
      jobTitle: newUser.jobTitle,
      teamId: newUser.teamId.toString(),
    });

    const isProduction = process.env.NODE_ENV === "production";

    // STORE TOKEN IN THE COOKIE
    res.cookie("auth_token", token, {
      httpOnly: true, // secure againts xss atack
      secure: isProduction, //process.env.NODE_ENV === "production", // change to production in deploy
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // store 7 days
    });

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });

    // res.status(201).json({
    //   status: "success",
    //   token,
    //   data: {
    //     user: newUser,
    //   },
    // });
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

    // 4) CREATE TOKEN AND STOER TO DB
    const token = createToken({
      id: user._id.toString(),
      name: user.name,
      family: user.family,
      role: user.role,
      jobTitle: user.jobTitle,
      teamId: user.teamId.toString(),
    });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("auth_token", token, {
      httpOnly: true, // secure againts xss atack
      secure: isProduction, //process.env.NODE_ENV === "production", // change to production in deploy
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // store 7 days
    });

    // 5) SEND RESPONSE
    res.status(200).json({
      status: "success",
      // token,
      data: {
        user,
      },
    });
  },
);

// CHECK PROTECTED ROUTE
exports.checkProtectedRoute = catchAsyncFn(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) GET TOKEN AND CHECK IF EXIST
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("شما وارد نشده اید ، لطفا در ابتدا وارد شوید.", 401),
      );
    }

    // 2) VERIFY TOKEN
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) CHECK IF THE USER EXIST
    const currUser = await User.findById(decode.id);
    if (!currUser) {
      return next(new AppError("کاربر متعلق به این توکن یافت نشد", 401));
    }
    // 4) CHECK THE PASSWORD DOES NOT MODIFIDE AFTER LOGIN
    if (currUser.isModifiedPasswordAfterToken(decode.iat)) {
      return next(
        new AppError(
          "کاربر به تازگی رمز عبود خود را تغییر داده است ، لطفا دوباره وارد شوید.",
          401,
        ),
      );
    }
    // 5) SETTING req.user AND CALL next()
    req.user = currUser;
    next();
  },
);

// authorization with manager acsees

exports.restricTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("شما به این به این روت دسترسی ندارید."));
    }
    next();
  };
};

// FORGET PASSWORD AND RE-STRAT PASSWORD
