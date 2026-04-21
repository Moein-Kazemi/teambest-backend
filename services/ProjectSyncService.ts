// GLOBAL ERROR
const AppError = require("./../utils/classes/AppError");
const TaskSyncService = require("./TaskSyncService");

// MODELS
const Project = require("./../models/projectModel");
// const Task = require("./../models/taskModel");

// TYPE CHECKER
import { NextFunction } from "express";
import { ITask } from "../interfaces/taskDocument";
import {
  IProject,
  IStage,
  ProjectDocument,
} from "../interfaces/projectDocument";
import { Result } from "../interfaces/compareStagesResults";
import isObjectChanged from "../utils/isObjectChanged";

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
  }

  // ==================== UPDATE PROJECT AND UPDATE TASKS ====================
  static async updateProjectAndSync(
    projectId: string,
    updateProjectData: Partial<IProject>,
    tasksData: ITask[] | null,
    next: NextFunction,
  ): Promise<ProjectDocument | void> {
    // WE CAN'T UPDATE TEAMID AND OWENERID UPDATEAT AND CREATEDAT
    if (
      updateProjectData.teamId ||
      updateProjectData.ownerId ||
      updateProjectData.updatedAt ||
      updateProjectData.createdAt
    ) {
      return next(
        new AppError(
          "you can't update teamId or ownerId or updateAt or createdAt",
          400,
        ),
      );
    }

    // 1) FIND OLD PROJECT
    const oldProject = await Project.findById(projectId);
    if (!oldProject)
      return next(new AppError("پروژه مورد نظر برای آپدیت شدن پیدا نشد.", 404));

    // UPDATE PROJECT
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateProjectData,
      {
        new: true,
        runValidators: true,
      },
    );

    // IF STAGES UPDATED WE HAVE TO SYNC WITH TASKS
    if (updateProjectData.stages) {
      const oldStages: IStage[] = oldProject.stages;
      const newStages: IStage[] = updatedProject.stages;

      const result = this.compareStages(oldStages, newStages);

      // IF THERE ARE ADDED STAGES
      if (result.added.length !== 0) {
        for (const stage of result.added) {
          for (const task of stage.taskAssignments) {
            // FILTER TASK BASE ON THE TITLE IN THE TASKASSIGNMENT
            const taskData = tasksData.find(
              (inTask) => inTask.title === task.taskTitle,
            );

            if (taskData) {
              // MUTATE TASKS DATA WITH NEW PROJECTID AND STAGEID
              taskData.projectId = updatedProject._id;
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
      } else if (result.removed.length !== 0) {
        // IF THERE ARE REMOVED STAGES
        for (const stage of result.removed) {
          for (const task of stage.taskAssignments) {
            // FILTER TASK BASE ON THE TITLE IN THE TASKASSIGNMENT
            const taskData = tasksData.find(
              (inTask) => inTask.title === task.taskTitle,
            );

            if (taskData) {
              // MUTATE TASKS DATA WITH NEW PROJECTID AND STAGEID
              taskData.projectId = updatedProject._id;
              taskData.stageId = stage._id;

              // DELETE TASK INTO TASK COLLECTION BASE ON REMOVED ARRAY AND FILTER.
              await TaskSyncService.deleteTaskAndSync(
                task.taskId.toString(),
                next,
              );
            }
          }
        }
      } else if (result.modified.length !== 0) {
        return next(
          new AppError(
            "در این مرحله شما نمیتوانید استیچ های قبلی را تغییر دهید . فقط میتوانید استیج های قبلی را حذف یا استیج جدید ایجاد کنید.",
            400,
          ),
        );
      }
    }

    return updatedProject;
  }
  // // ==================== COMPARE STAGES ====================
  static compareStages(oldStages: IStage[], newStages: IStage[]): Result {
    const result: Result = {
      added: [],
      removed: [],
      modified: [],
    };

    // 1) FIND ADDED ITEM
    for (const newItem of newStages) {
      const oldItem = oldStages.find(
        (old) => old._id?.toString() === newItem._id?.toString(),
      );

      // IF OLDITEM DOSE NOT EXIST IT MEANS ADD NEW STAGES
      if (!oldItem) {
        result.added.push(newItem);
        // IF THE OLDITEM EXIST CHECK IF CHANGE FROM OLDER ONE.
      } else if (isObjectChanged(oldItem, newItem)) {
        result.modified.push({
          old: oldItem,
          new: newItem,
        });
      }
    }

    // 2) FIND DELETED ITEM.
    for (const oldItem of oldStages) {
      const newItem = newStages.find(
        (newI) => newI._id?.toString() === oldItem._id?.toString(),
      );
      // IF NEWITEM DOSE NOT EXIST IT MEANS DELETE FROM STAGES.
      if (!newItem) {
        result.removed.push(oldItem);
      }
    }

    return result;
  }
  // // ==================== COMPARE STAGE OBJECTS ====================

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
