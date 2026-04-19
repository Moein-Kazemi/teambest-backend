import { Schema, Document } from "mongoose";

// ==================== Task Assignment (درون Stages) ====================
export interface ITaskAssignment {
  taskId?: Schema.Types.ObjectId | string;
  taskTitle: string;
  assigneeId: Schema.Types.ObjectId | string;
  assigneeName: string;
}

// ==================== Stage ====================
export interface IStage {
  _id?: Schema.Types.ObjectId | string;
  name: string;
  order: number;
  taskAssignments?: ITaskAssignment[];
}

// ==================== Project ====================
export interface IProject {
  name: string;
  description?: string;
  teamId: Schema.Types.ObjectId | string;
  ownerId: Schema.Types.ObjectId | string;
  stages: IStage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectDocument = IProject & Document;
