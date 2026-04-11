/* 
Tasks
├── _id
├── title
├── description
├── projectInfo: {_id , name}
├── assigneeTo:{_id , name}
├── stageInfo:{_id , name}
├── status (pending/in-progress/done)
├── startDate 
├── endDate 
└── createdAt
*/
import { model, Schema } from "mongoose";

// TYPE CHECKER
import { TaskProp } from "../interfaces/taskDocument";

// 1) CREATE SCHEMA
const taskSchema = new Schema<TaskProp>({
  title: {
    type: String,
    required: [true, "Task must have title."],
    trim: true,
    minlength: [3, "your task must be more than 3 charectors."],
    maxlength: [12, "your task must be less than 12 charectors."],
  },
  description: {
    type: String,
    required: [true, "Task must have dscription."],
    trim: true,
  },
  projectInfo: {
    type: Object,
    default: {},
  },
  assigneeTo: {
    type: Object,
    default: {},
  },
  stageInfo: {
    type: Object,
    default: {},
  },
  status: {
    type: String,
    enum: {
      values: ["انجام نشده", "در حال انجام", "انجام شده"],
      message:
        "you have to use on of the valid status (انجام نشده - در حال انجام - انجام شده)",
    },
    default: "انجام نشده",
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

// 2) CREATE MODEL

const Task = model("Task", taskSchema, "tasks");

module.exports = Task;
