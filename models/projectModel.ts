import { model, Schema } from "mongoose";
import {
  IProject,
  IStage,
  ITaskAssignment,
  ProjectDocument,
} from "../interfaces/projectDocument";

// ==================== Schema ====================
// EMBEDED DOCUMENT
const taskAssignmentSchema = new Schema<ITaskAssignment>(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    taskTitle: { type: String, required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assigneeName: { type: String, required: true },
  },
  { _id: false },
);

const stageSchema = new Schema<IStage>(
  {
    name: { type: String, required: true },
    order: { type: Number, required: true, default: 1 },
    taskAssignments: { type: [taskAssignmentSchema], default: [] },
  },
  { _id: true },
);

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stages: { type: [stageSchema], default: [] },
  },
  { timestamps: true },
);

// ==================== Model ====================
const Project = model<ProjectDocument>("Project", projectSchema, "projects");

module.exports = Project;
