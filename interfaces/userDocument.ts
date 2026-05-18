import { Document, Schema } from "mongoose";

export interface IUser {
  name: string;
  family: string;
  jobTitle: string;
  phone: string;
  email?: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt?: Date;
  role: "user" | "member" | "manager";
  teamId: Schema.Types.ObjectId | string;
  avatar: string;
  isCorrectPassword?: (
    condidPassword: string,
    userPassword: string,
  ) => Promise<boolean>;
  isModifiedPasswordAfterToken?: (jwtTimeStamp: string) => boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = IUser & Document;
