import { Document, Schema } from "mongoose";

export interface IAssignee {
  assigneeId?: Schema.Types.ObjectId | string;
  assigneeName?: string;
}
export type AssigneeDocument = IAssignee & Document;

// TASK PROP AND DOCUMENT
export interface ITask {
  projectId: Schema.Types.ObjectId | string;
  stageId: Schema.Types.ObjectId | string;
  title: string;
  description: string;
  assigneeTo: IAssignee;
  status?: "انجام نشده" | "در حال انجام" | "انجام شده";
  priority?: "کم" | "متوسط" | "زیاد" | "خیلی زیاد";
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TaskDocument = ITask & Document;

/* 
// ==================== Task ====================
export interface ITask extends Document {
  projectId: Schema.Types.ObjectId;
  stageId: Schema.Types.ObjectId;
  title: string;
  description?: string;
 assigneeTo : IAssigne
  status: 'pending' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
*/
