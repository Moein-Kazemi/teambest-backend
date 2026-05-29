import { Document, Schema } from "mongoose";

// ==================== ITeamMember ====================
export interface ITeamMember {
  memberId: Schema.Types.ObjectId | string;
  memberName: string;
  memberAvatar: string;
  memberJobTitle: string;
}

// ==================== ITeamProject ====================
export interface ITeamProject {
  projectId: Schema.Types.ObjectId | string;
  projectName: string;
}
// ==================== ITeam ====================
export interface ITeam {
  name: string;
  summary: string;
  logo: string;
  ownerId: Schema.Types.ObjectId | string;
  members: ITeamMember[];
  projects?: ITeamProject[];
}

export type TeamDocument = ITeam & Document;
