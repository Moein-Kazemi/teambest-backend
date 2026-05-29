/* 
Teams
├── _id
├── name
├── description
├── ownerId (مدیر تیم)
├── members[]
│   ├── userId
│   └── role
├── projectIds[]
└── createdAt
*/

import { model, Schema } from "mongoose";
import {
  ITeam,
  ITeamMember,
  ITeamProject,
  TeamDocument,
} from "../interfaces/teamDocument";

// ==================== Subdocument Schemas ====================

// TEAM MEMBERS SCHEMA
const teamMemberSchema = new Schema<ITeamMember>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "اعضای تیم باید شناسه داشته باشند"],
    },
    memberName: {
      type: String,
      required: [true, "اعضای تیم باید نام داشته باشند"],
    },
    memberAvatar: {
      type: String,
      required: [true, "اعضای تیم باید آواتار داشته باشند"],
    },
    memberJobTitle: {
      type: String,
      required: [true, "اعضای تیم باید عنوان شغلی داشته باشند"],
    },
  },
  { _id: false },
);

// TEAM PROJECT SCHEMA
const teamProjectSchema = new Schema<ITeamProject>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "پروژه تیم باید شناسه داشته باشد"],
    },
    projectName: {
      type: String,
      required: [true, "پروژه تیم باید نام داشته باشد"],
    },
  },
  { _id: false },
);

// ==================== Main Team Schema ====================

const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: [true, "نام تیم الزامی است"],
      trim: true,
      minLength: [3, "نام تیم باید بیشتر از 3 کارکتر باشد."],
      maxlength: [100, "نام تیم نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"],
    },
    summary: {
      type: String,
      required: [true, "خلاصه تیم الزامی است"],
      minLength: [10, "خلاصه فعالیت تیم باید بیشتر از 10 کارکتر باشد."],
      maxlength: [500, "خلاصه تیم نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"],
    },
    logo: {
      type: String,
      default: "",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: [teamMemberSchema],
    projects: {
      type: [teamProjectSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// FOR FAST SEARCH BASE ON THE NAME
teamSchema.index({ name: 1 });

// CREATE MODEL
const Team = model<TeamDocument>("Team", teamSchema, "teams");

module.exports = Team;
