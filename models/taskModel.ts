import { model, Schema } from "mongoose";

// TYPE CHECKER
import { IAssignee, ITask, TaskDocument } from "../interfaces/taskDocument";

// 1) CREATE SCHEMA

// SUBDOCUMENT: assignee document for user into task
const assigneeSchema = new Schema<IAssignee>({
  assigneeId: { type: Schema.Types.ObjectId, ref: "User" },
  assigneeName: { type: String },
});

const taskSchema = new Schema<ITask>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    stageId: { type: Schema.Types.ObjectId, required: true },
    title: {
      type: String,
      required: [true, "Task must have title."],
      trim: true,
      minlength: [3, "your task must be more than 3 charectors."],
      unique: [true, "A task must have unique title."],
    },
    description: {
      type: String,
      required: [true, "Task must have dscription."],
      trim: true,
    },
    assigneeTo: {
      type: assigneeSchema,
      required: true,
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
    priority: {
      type: String,
      enum: {
        values: ["کم", "متوسط", "زیاد", "خیلی زیاد"],
      },
      default: "کم",
    },
    startDate: {
      type: Date,
      default: new Date(),
    },
    endDate: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true },
);

// fast search base on projectId and stageId and also with project Id alone
// slow search base on stage Id alone . so the priority of the index is important
taskSchema.index({ projectId: 1, stageId: 1 });
taskSchema.index({ assigneeId: 1 });

// 2) CREATE MODEL

const Task = model<TaskDocument>("Task", taskSchema, "tasks");

module.exports = Task;
