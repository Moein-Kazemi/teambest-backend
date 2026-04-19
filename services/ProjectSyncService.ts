// GLOBAL ERROR
const AppError = require("./../utils/classes/AppError");
const TaskSyncService = require("./TaskSyncService");

// MODELS
const Project = require("./../models/projectModel");
// const Task = require("./../models/taskModel");

// TYPE CHECKER
import { NextFunction } from "express";
import { ITask } from "../interfaces/taskDocument";
import { IProject, ProjectDocument } from "../interfaces/projectDocument";

module.exports = class ProjectSyncService {
  // ==================== CREATE PROJECT AND UPDATE TASKS====================
  static async createProjectAndSync(
    teamId: string,
    projectData: IProject,
    tasksData: ITask[],
    next: NextFunction,
  ): Promise<ProjectDocument | void> {
    // 1) CHECK IF THE PROJECT EXISTS SHOW ERROR
    const alreadyProject = await Project.find({ name: projectData.name });
    if (alreadyProject.length !== 0)
      return next(new AppError("پروژه مورد نظر از قبل ایجاد شده است.", 400));

    // 2) CHECK IF THE PROJECT DON'T HAVE STAGES SHOW ERROR
    if (projectData.stages.length === 0)
      return next(
        new AppError("پروژه مورد نظر باید داری مراحل یا استیج هایی باشد.", 400),
      );

    // 3) CREATE PROJECT
    const project: ProjectDocument = await Project.create(projectData);
    if (!project) return next(new AppError("پروژه به دلایلی ساخته نشد.", 400));

    // 4)FOR EACH STAGE & TASKASSIGNMENT CREATE TASK AND UPDATE PROJECT
    for (const stage of project.stages) {
      for (const task of stage.taskAssignments) {
        // FILTER TASK BASE ON THE TITLE IN THE TASKASSIGNMENT
        const taskData = tasksData.find(
          (inTask) => inTask.title === task.taskTitle,
        );

        if (taskData) {
          // MUTATE TASKS DATA WITH NEW PROJECTID AND STAGEID
          taskData.projectId = project._id;
          taskData.stageId = stage._id;
          // CREATE TASK INTO TASK COLLECTIONS BASE ON RESULT OF THE FILTER TASK.
          await TaskSyncService.createTaskAndSync(
            taskData.projectId.toString(),
            taskData.stageId.toString(),
            taskData,
            next,
          );
        }
      }
    }

    return project;
  }

  // 5) ADD PROJECT REFERENCE TO TEAM
  // await Team.findByIdAndUpdate(teamId, {
  //   $push: {
  //     projects: {
  //       projectId: project._id,
  //       projectName: project.name,
  //       ownerId: project.ownerId,
  //     },
  //   },
  // });

  // ==================== UPDATE TASK AND UPDATE PROJECT ====================
  // static async updateTaskAndSync(
  //   taskId: string,
  //   updateData: Partial<ITask>,
  //   next: NextFunction,
  // ): Promise<TaskDocument | void> {
  //   // 1) FIND OLD TAKS
  //   const oldTask = await Task.findById(taskId);
  //   if (!oldTask) return next(new AppError("تسک پیدا نشد", 404));
  //   const stageId = oldTask.stageId.toString();

  //   // UPDATE TASK
  //   const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
  //     new: true,
  //     runValidators: true,
  //   });

  //   // If update.title or update.assigneeTo does exist compare that to old one
  //   if (updateData.title || updateData.assigneeTo) {
  //     // 2) IF TITLE OR ASSIGNEENAME OR ASSIGENID IS CHANGE , UPDATE PROJECT
  //     if (
  //       updateData?.title !== oldTask.title ||
  //       updateData.assigneeTo?.assigneeName !==
  //         oldTask.assigneeTo?.assigneeName ||
  //       updateData.assigneeTo?.assigneeId?.toString() !==
  //         oldTask.assigneeTo?.assigneeId.toString()
  //     ) {
  //       await Project.updateOne(
  //         {
  //           "stages.taskAssignments.taskId": new Types.ObjectId(taskId),
  //         },
  //         {
  //           $set: {
  //             "stages.$[stage].taskAssignments.$[task].taskTitle":
  //               updateData?.title || oldTask?.title,
  //             "stages.$[stage].taskAssignments.$[task].assigneeName":
  //               updateData?.assigneeTo?.assigneeName ||
  //               oldTask?.assigneeTo?.assigneeName,
  //             "stages.$[stage].taskAssignments.$[task].assigneeId":
  //               updateData?.assigneeTo?.assigneeId ||
  //               oldTask?.assigneeTo?.assigneeId,
  //           },
  //         },
  //         {
  //           arrayFilters: [
  //             { "stage._id": new Types.ObjectId(stageId) },
  //             { "task.taskId": new Types.ObjectId(taskId) },
  //           ],
  //         },
  //       );
  //     }
  //   }
  //   // IF STAGE IS CHANGE AND ONE TASK GO FROM ONE STAGE TO ANOTHER STAGE.
  //   if (
  //     updateData.stageId &&
  //     updateData.stageId.toString() !== oldTask.stageId?.toString()
  //   ) {
  //     await this.moveTaskBetweenStages(
  //       oldTask.projectId.toString(),
  //       oldTask.stageId.toString(),
  //       updateData.stageId.toString(),
  //       taskId,
  //       next,
  //     );
  //   }

  //   return updatedTask;
  // }

  // // ==================== MOVE TASK FROM ONE STAGE TO ANOTHER STAGE ====================
  // static async moveTaskBetweenStages(
  //   projectId: string,
  //   fromStageId: string,
  //   toStageId: string,

  //   taskId: string,
  //   next: NextFunction,
  // ): Promise<void> {
  //   const project = await Project.findById(projectId);
  //   if (!project) return next(new AppError("پروژه مورد نظر یافت نشد", 404));

  //   // find from stage and taskAssignment
  //   const fromStage = project.stages.id(fromStageId);
  //   if (!fromStage) return next(new AppError("استیج مورد نظر پیدا نشد.", 404));

  //   const taskAssignment = fromStage?.taskAssignments.find(
  //     (t: ITaskAssignment) => t.taskId.toString() === taskId,
  //   );
  //   if (!taskAssignment)
  //     return next(new AppError("تسک در استیج مورد نظر پیدا نشد.", 404));

  //   // delete task from sourse stage
  //   await Project.findOneAndUpdate(
  //     { _id: projectId, "stages._id": fromStageId },
  //     {
  //       $pull: {
  //         "stages.$.taskAssignments": { taskId: new Types.ObjectId(taskId) },
  //       },
  //     },
  //   );

  //   //  add taks do destenation stage
  //   await Project.findOneAndUpdate(
  //     { _id: projectId, "stages._id": toStageId },
  //     {
  //       $push: { "stages.$.taskAssignments": taskAssignment },
  //     },
  //   );
  // }

  // // ==================== DELETE TASK FROM TASK COLLECTIONS AND UPDATE PROJECT ====================
  // static async deleteTaskAndSync(
  //   taskId: string,
  //   next: NextFunction,
  // ): Promise<TaskDocument | void> {
  //   const task = await Task.findById(taskId);
  //   if (!task) return next(new AppError("تسک مورد نظر پیدا نشد.", 404));

  //   // 1) delete from project
  //   await Project.updateOne(
  //     { "stages.taskAssignments.taskId": taskId },
  //     {
  //       $pull: {
  //         "stages.$[].taskAssignments": { taskId: new Types.ObjectId(taskId) },
  //       },
  //     },
  //   );

  //   // 2) Delete Task
  //   return await Task.findByIdAndDelete(taskId);
};
