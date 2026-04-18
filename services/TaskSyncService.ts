// GLOBAL ERROR
const AppError = require("./../utils/classes/AppError");

// MODELS
const Project = require("./../models/projectModel");
const Task = require("./../models/taskModel");

// TYPE CHECKER
import { NextFunction } from "express";
import { ITask, TaskDocument } from "../interfaces/taskDocument";
import { ITaskAssignment } from "../interfaces/projectDocument";
import { Types } from "mongoose";

module.exports = class TaskSyncService {
  // ==================== CREATE TASK AND UPDATE PROJECT====================
  static async createTaskAndSync(
    projectId: string,
    stageId: string,
    taskData: ITask,
    next: NextFunction,
  ): Promise<TaskDocument | void> {
    // CHECK IF NOT EXIST
    const taskExist = await Task.find({ title: taskData.title });
    if (taskExist.length !== 0)
      return next(new AppError("تسک از قبل وجود دارد", 400));

    // 1) CREATE TASK
    const task = await Task.create(taskData);

    // 2) ADD TO STAGES IN THE PROJECT
    await Project.findOneAndUpdate(
      { _id: projectId, "stages._id": stageId },
      {
        $push: {
          "stages.$.taskAssignments": {
            taskId: task._id,
            taskTitle: task.title,
            assigneeId: task.assigneeTo.assigneeId,
            assigneeName: task.assigneeTo.assigneeName,
          },
        },
      },
    );

    return task;
  }

  // ==================== UPDATE TASK AND UPDATE PROJECT ====================
  static async updateTaskAndSync(
    taskId: string,
    updateData: Partial<ITask>,
    next: NextFunction,
  ): Promise<TaskDocument | void> {
    // 1) FIND OLD TAKS
    const oldTask = await Task.findById(taskId);
    if (!oldTask) return next(new AppError("تسک پیدا نشد", 404));
    const stageId = oldTask.stageId.toString();

    // UPDATE TASK
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    // If update.title or update.assigneeTo does exist compare that to old one
    if (updateData.title || updateData.assigneeTo) {
      // 2) IF TITLE OR ASSIGNEENAME OR ASSIGENID IS CHANGE , UPDATE PROJECT
      if (
        updateData?.title !== oldTask.title ||
        updateData.assigneeTo?.assigneeName !==
          oldTask.assigneeTo?.assigneeName ||
        updateData.assigneeTo?.assigneeId?.toString() !==
          oldTask.assigneeTo?.assigneeId.toString()
      ) {
        await Project.updateOne(
          {
            "stages.taskAssignments.taskId": new Types.ObjectId(taskId),
          },
          {
            $set: {
              "stages.$[stage].taskAssignments.$[task].taskTitle":
                updateData?.title || oldTask?.title,
              "stages.$[stage].taskAssignments.$[task].assigneeName":
                updateData?.assigneeTo?.assigneeName ||
                oldTask?.assigneeTo?.assigneeName,
              "stages.$[stage].taskAssignments.$[task].assigneeId":
                updateData?.assigneeTo?.assigneeId ||
                oldTask?.assigneeTo?.assigneeId,
            },
          },
          {
            arrayFilters: [
              { "stage._id": new Types.ObjectId(stageId) },
              { "task.taskId": new Types.ObjectId(taskId) },
            ],
          },
        );
      }
    }
    // IF STAGE IS CHANGE AND ONE TASK GO FROM ONE STAGE TO ANOTHER STAGE.
    if (
      updateData.stageId &&
      updateData.stageId.toString() !== oldTask.stageId?.toString()
    ) {
      await this.moveTaskBetweenStages(
        oldTask.projectId.toString(),
        oldTask.stageId.toString(),
        updateData.stageId.toString(),
        taskId,
        next,
      );
    }

    return updatedTask;
  }

  // // ==================== MOVE TASK FROM ONE STAGE TO ANOTHER STAGE ====================
  static async moveTaskBetweenStages(
    projectId: string,
    fromStageId: string,
    toStageId: string,

    taskId: string,
    next: NextFunction,
  ): Promise<void> {
    const project = await Project.findById(projectId);
    if (!project) return next(new AppError("پروژه مورد نظر یافت نشد", 404));

    // find from stage and taskAssignment
    const fromStage = project.stages.id(fromStageId);
    if (!fromStage) return next(new AppError("استیج مورد نظر پیدا نشد.", 404));

    const taskAssignment = fromStage?.taskAssignments.find(
      (t: ITaskAssignment) => t.taskId.toString() === taskId,
    );
    if (!taskAssignment)
      return next(new AppError("تسک در استیج مورد نظر پیدا نشد.", 404));

    // delete task from sourse stage
    await Project.findOneAndUpdate(
      { _id: projectId, "stages._id": fromStageId },
      {
        $pull: {
          "stages.$.taskAssignments": { taskId: new Types.ObjectId(taskId) },
        },
      },
    );

    //  add taks do destenation stage
    await Project.findOneAndUpdate(
      { _id: projectId, "stages._id": toStageId },
      {
        $push: { "stages.$.taskAssignments": taskAssignment },
      },
    );
  }

  // // ==================== DELETE TASK FROM TASK COLLECTIONS AND UPDATE PROJECT ====================
  static async deleteTaskAndSync(
    taskId: string,
    next: NextFunction,
  ): Promise<TaskDocument | void> {
    const task = await Task.findById(taskId);
    if (!task) return next(new AppError("تسک مورد نظر پیدا نشد.", 404));

    // 1) delete from project
    await Project.updateOne(
      { "stages.taskAssignments.taskId": taskId },
      {
        $pull: {
          "stages.$[].taskAssignments": { taskId: new Types.ObjectId(taskId) },
        },
      },
    );

    // 2) Delete Task
    return await Task.findByIdAndDelete(taskId);
  }
};
