import bcrypt from "bcrypt";
import { Types } from "mongoose";
export const adminCrudFunctions = (modules: any) => {
  return {
    fetchAllUsers: async () => {
      const data = await modules.find();
      return data;
      // function to fetch all users ...
    },
    createUsers: async (
      name: string,
      email: string,
      department: string,
      password: string,
    ) => {
      let salt = bcrypt.genSaltSync(10);
      let hash2 = bcrypt.hashSync(password, salt);
      const employ_Obj = new modules({
        name: name,
        email: email,
        department: department,
        password: hash2,
      });
      let emplyObj = await employ_Obj.save();
      return emplyObj;
      // function to create users ....
    },
    updateEmployess: async (
      id: string,
      name: string,
      email: string,
      department: string,
    ) => {
      let updateEmploye = await modules.findByIdAndUpdate(
        id,
        {
          name,
          email,
          department,
        },
        {
          new: true,
          runvalidators: true,
        },
      );
      return updateEmploye;
    },

    deleteEmploye: async (id: string) => {
      let deletedEmploye = await modules.findByIdAndDelete(
        new Types.ObjectId(id),
      );
      return deletedEmploye.name;
    },
    createDepartments: async (
      id: string,
      title: string,
      color: string,
      description: string,
    ) => {
      let departmentObj = new modules({
        id,
        title,
        color,
        description,
      });

      let newDep = await departmentObj.save();
      return newDep;
    },

    fetchDepartments: async () => {
      const depdata = await modules.find();
      return depdata;
    },
    deleteDepartmetns: async (id: string) => {
      let deleteDepartment = await modules.findByIdAndDelete(id);
      return deleteDepartment.title;
    },
    updateDepartments: async (
      id: string,
      title: string,
      color: string,
      description: string,
    ) => {
      let updateDepartment = await modules.findByIdAndUpdate(
        id,
        {
          id,
          title,
          color,
          description,
        },
        {
          new: true,
          runValidators: true,
        },
      );
      return updateDepartment;
    },

    addAttendance: async (action: String, id: String) => {
      if (action && id) {
        const today = new Date().toISOString().split("T")[0];
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        let attendanceObj = await modules.findOne({ userId: id, date: today });
        if (!attendanceObj) {
          attendanceObj = await new modules({
            userId: id,
            date: today,
            logs: [
              {
                firstnoon: {
                  timeIn: time,
                  timeOut: null,
                },
                secondnoon: {
                  timeIn: null,
                  timeOut: null,
                },
              },
            ],
          });
          attendanceObj.save();
        } else {
          switch (action) {
            case "LUNCH_START":
              attendanceObj.logs[0].firstnoon.timeOut = time;
              break;

            case "LUNCH_END":
              attendanceObj.logs[0].secondnoon.timeIn = time;
              break;

            case "PUNCH_OUT":
              attendanceObj.logs[0].secondnoon.timeOut = time;
              break;
          }
          attendanceObj.save();
        }
      }
    },

    retriveLogs: async (id: string) => {
      let data = await modules.aggregate([
        // { $project: { first: { $arrayElemAt: ["$logs.firstnoon", 0], } , second: { $arrayElemAt: ["$logs.secondnoon", 0], } } }
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "attendance",
          },
        },

        {
          $project: {
            first: { $arrayElemAt: ["$logs.firstnoon", 0] },
            second: { $arrayElemAt: ["$logs.secondnoon", 0] },
            users: { $arrayElemAt: ["$attendance", 0] },
          },
        },
      ]);

      return data;
    },

    DailyReports: async (
      title: string,
      desc: string,
      deptId: string,
      type: string,
      date: string,
    ) => {
      let repoObj = new modules({
        title,
        desc,
        deptId,
        type,
        date,
      });
      let repoData = await repoObj.save();
      // console.log(repoData);
      return repoData;
    },
    readReports: async () => {
      let data = await modules.find();
      return data;
    },
  };
};
