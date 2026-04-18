import { Schema, Document } from "mongoose";

// ==================== Task Assignment (درون Stages) ====================
export interface ITaskAssignment {
  taskId?: Schema.Types.ObjectId;
  taskTitle: string;
  assigneeId: Schema.Types.ObjectId;
  assigneeName: string;
}

// ==================== Stage ====================
export interface IStage {
  name: string;
  order: number;
  taskAssignments?: ITaskAssignment[];
}

// ==================== Project ====================
export interface IProject {
  name: string;
  description?: string;
  teamId: Schema.Types.ObjectId;
  ownerId: Schema.Types.ObjectId;
  stages?: IStage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectDocument = IProject & Document;
