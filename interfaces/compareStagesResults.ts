import { IStage } from "./projectDocument";

export interface Result {
  added: IStage[];
  removed: IStage[];
  modified: { old: IStage; new: IStage }[];
}
