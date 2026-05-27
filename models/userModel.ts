const validator = require("validator");
const bcrypt = require("bcrypt");

import { IUser, UserDocument } from "../interfaces/userDocument";
import { model, Schema } from "mongoose";

const userSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "نام کاربر الزامی است"],
      minlength: [3, "نام باید حداقل سه کارکتر باشد."],
      maxlength: [10, "نام نباید بیش از 10 کارکتر باشد."],
      trim: true,
    },
    family: {
      type: String,
      required: [true, "نام خانوادگی کاربر الزامی است"],
      minlength: [3, "نام خانوادگی باید حداقل سه کارکتر باشد."],
      maxlength: [10, "نام خانوادگی نباید بیش از 10 کارکتر باشد."],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "شماره تلفن الزامی است"],
      unique: [true, "شماره تماس شما با شماره تماس شخص دیگری یکسان است."],
      validate: {
        validator: function (val: string) {
          return validator.isMobilePhone(val, "fa-IR");
        },
        message: "شماره تماس نامعتبر است.",
      },
      trim: true,
    },
    password: {
      type: String,
      required: [true, "رمز عبور الزامی است"],
      minlength: [6, "رمز عبور باید حداقل ۶ کاراکتر باشد"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "کاربر باید passwordConfirm را داشته باشد"],
      validate: {
        validator: function (this: UserDocument, val: string): boolean {
          return this.password === val ? true : false;
        },
        message: "password & passwordConfirm must be equal!",
      },
    },
    passwordChangedAt: {
      type: Date,
    },
    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "لطفاً یک ایمیل معتبر وارد کنید"],
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["user", "member", "manager"],
        message: "نقش کاربر باید user، member یا manager باشد",
      },
      default: "user",
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// not show some fields that we don't need .
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// HASH USER PASSWORD
userSchema.pre("save", async function (next) {
  // IF THE PASSWORD NOT MODIFIED WE SIMPLY RETURN
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// INSTANCE METHODS
userSchema.methods.isCorrectPassword = async function (
  condidPassword,
  userPassword,
) {
  return await bcrypt.compare(condidPassword, userPassword);
};

userSchema.methods.isModifiedPasswordAfterToken = function (
  jwtTimeStamp: string,
) {
  if (this.passwordChangedAt) {
    const changePasswordTime = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    console.log(changePasswordTime, jwtTimeStamp);
    return changePasswordTime > Number(jwtTimeStamp);
  }
  console.log("password not changed");
  return false;
};

// 2) CREATE USER MODAL
const User = model<UserDocument>("User", userSchema, "users");

module.exports = User;
