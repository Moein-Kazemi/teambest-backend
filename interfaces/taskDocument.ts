import { Document } from "mongoose";

export interface TaskProp {
  title: string;
  description: string;
  projectInfo?: { _id: string; name: string };
  assigneeTo?: { _id: string; name: string };
  //   remove if the project info hase stage field
  stageInfo?: { _id: string; name: string };
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export type TaskDocument = TaskProp & Document;
