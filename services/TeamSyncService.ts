const User = require("./../models/userModel");
const Team = require("./../models/teamModel");
const AppError = require("./../utils/classes/AppError");
import { NextFunction } from "express";
import { ITeam, ITeamMember, TeamDocument } from "../interfaces/teamDocument";
import { UserDocument } from "../interfaces/userDocument";
import { FilterQuery } from "mongoose";

module.exports = class TeamSyncService {
  // CREATE TEAM
  static async createTeamAndSync(
    teamData: ITeam,
    members: ITeamMember[],
    next: NextFunction,
  ): Promise<TeamDocument | void> {
    //  CHECK MANAGER DETAILS
    const manager: UserDocument = await User.findOne({
      _id: teamData.ownerId,
    }).lean();
    if (manager.role !== "manager" || manager.teamId !== null) {
      return next(
        new AppError("کاربر ایجاد کننده تیم اجازه ایجاد تیم را ندارد.", 401),
      );
    }
    // extract membersIds
    const memberIds = members.map((member) => member.memberId);

    // CHECK IF THE IDS EXIST AND ROLE = MEMBER
    const filter: FilterQuery<UserDocument> = {
      _id: { $in: memberIds }, // FIRST CONDITION
      role: "member", // SECOND CONDITION
      teamId: null, // CHECK IF TEAMID NULL
    };

    // SELECT ROLE = MEMEBER IN THE DB
    const eligibleUsers: UserDocument[] = await User.find(
      filter,
      "_id name family",
    ).lean();

    // SELECT VALID IDS IN THE DB
    const foundUserIds = eligibleUsers.map((user) => user._id.toString());

    //  CHECK INVALID MEMBER IDS FROM INPUT
    const invalidMemberIds = memberIds.filter(
      (id) => !foundUserIds.includes(id.toString()),
    );
    if (invalidMemberIds.length > 0) {
      return next(new AppError("بعضی از اعضای انتخاب شده معتبر نمیباشند", 400));
    }

    // PREPERE VALID MEMBERS
    const validMembers = eligibleUsers.map((user) => ({
      memberId: user._id,
      memberName: `${user.name} ${user.family}`,
    }));

    // NEW TEAM DATA
    const newTeamData = {
      ...teamData,
      members: validMembers,
    };

    // CREATE TEAM
    const createTeam = await Team.create(newTeamData);
    if (!createTeam) return next(new AppError("تیم تشکیل نشد.", 400));

    // UPDATA TEAMIDS OF ELIGABLE USERS IN THE DB
    const allUserIdsToSync = [
      teamData.ownerId, // owend id
      ...validMembers.map((m) => m.memberId), // memeber ids
    ];

    //  EXTRATCT UNIQE ID
    const uniqueUserIds = [...new Set(allUserIdsToSync)];

    if (uniqueUserIds.length > 0) {
      // updata team ids of all team users
      const allTeamUsers: UserDocument[] = await User.updateMany(
        { _id: { $in: uniqueUserIds } },
        { $set: { teamId: createTeam._id } },
      );
      if (allTeamUsers.length === 0)
        return next(new AppError("اعضای تیم به تیم اضافه نشدند.", 400));
    }

    return createTeam;
  }

  // UPDATE TEAM
  static async updateTeamAndSync(
    teamId: string,
    updateData: Partial<ITeam>,
    next: NextFunction,
  ): Promise<TeamDocument | void> {
    // FIND CURRENT TEAM
    const currentTeam = await Team.findById(teamId);
    if (!currentTeam) {
      return next(new AppError("تیم پیدا نشد.", 404));
    }

    // PREVENT UPDATA OWNER ID
    if (
      updateData.ownerId &&
      updateData.ownerId.toString() !== currentTeam.ownerId.toString()
    ) {
      return next(new AppError("نمیتوان شناسه مدیر تیم را عوض کرد", 400));
    }

    // MAKE READY UPDATA DATA
    const teamUpdateFields: Partial<ITeam> = {
      name: updateData.name,
      summary: updateData.summary,
      logo: updateData.logo,
    };

    // IF THE MEMBERS ADD OR DELETE
    if (updateData.members) {
      const newMembers: ITeamMember[] = updateData.members;
      const oldMembers: ITeamMember[] = currentTeam.members;

      // conver ObjectId to string
      const newMemberIds = newMembers.map((member) =>
        member.memberId.toString(),
      );
      const oldMemberIds = oldMembers.map((member) =>
        member.memberId.toString(),
      );

      const addedMemberIds = newMemberIds.filter(
        (id) => !oldMemberIds.includes(id),
      );
      const removedMemberIds = oldMemberIds.filter(
        (id) => !newMemberIds.includes(id),
      );

      // MANAGE ADDED MEMBERS
      if (addedMemberIds.length > 0) {
        const addedUsers: UserDocument[] = await User.find(
          {
            _id: { $in: addedMemberIds },
            role: "member",
            teamId: null,
          },
          "_id name family",
        ).lean();

        const validAddedUsers = addedUsers.map((user) => user._id.toString());
        const invalidAddedIds = addedMemberIds.filter(
          (id) => !validAddedUsers.includes(id),
        );

        if (invalidAddedIds.length > 0) {
          return next(new AppError("عضو جدید تیم معتبر نمیباشد", 400));
        }

        //  UPATA THE TEAMID OF THE USERS
        const updatedUsers: UserDocument[] = await User.updateMany(
          { _id: { $in: validAddedUsers } },
          { $set: { teamId: currentTeam._id } },
        );
        if (updatedUsers.length === 0) {
          return next(new AppError("کاربران به تیم اضافه نشدند.", 400));
        }
      }
      // MANAGE REMOVED MEMBERS
      if (removedMemberIds.length > 0) {
        const deleteTeamMembers: UserDocument[] = await User.updateMany(
          { _id: { $in: removedMemberIds } },
          { $set: { teamId: null } },
        );

        if (deleteTeamMembers.length === 0) {
          return next(new AppError("اعضای قبلی تیم حذف نشدند", 400));
        }
      }

      // STOER NEW MEMBERS IN THE TEAM UPDATES FIELDS
      teamUpdateFields.members = newMembers;
    }

    // DELETE UNDIFIND FIELDS
    const validUpdateFields = Object.fromEntries(
      Object.entries(teamUpdateFields).filter(([_, v]) => v !== undefined),
    );

    const updatedTeam: TeamDocument = await Team.findByIdAndUpdate(
      teamId,
      { $set: validUpdateFields },
      { new: true, runValidators: true },
    );
    if (!updatedTeam) {
      return next(new AppError("تیم مورد نظر آپدیت نشد.", 400));
    }

    return updatedTeam;
  }

  // DELETE TEAM
  static async deleteTeam(
    teamId: string,
    next: NextFunction,
  ): Promise<TeamDocument | void> {
    //1) CHECK IF THE TEAM IS EXIST

    const team = await Team.findById(teamId);
    if (!team) {
      return next(new AppError("تیم مورد نظر پیدا نشد", 404));
    }

    // 2) UPDATA TEAMID OF THE USERS IN THE TEAM

    const teamMembers: ITeamMember[] = [...team.members];

    const userIdsToUnassign = [
      team.ownerId,
      ...teamMembers.map((member) => member.memberId),
    ];

    // detect unique id
    const uniqueUserIds = [...new Set(userIdsToUnassign)];

    const updatedUsers: UserDocument[] = await User.updateMany(
      { _id: { $in: uniqueUserIds } },
      { $set: { teamId: null } },
    );
    if (updatedUsers.length === 0) {
      return next(new AppError("کاربران از تیم حذف نشدند.", 400));
    }
    // 3) DELETE TEAM
    const deleteTeam = await Team.findByIdAndDelete(teamId);
    if (!deleteTeam) {
      return next(new AppError("تیم حذف نشد.", 400));
    }

    return deleteTeam;
  }
};
