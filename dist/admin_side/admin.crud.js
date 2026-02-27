"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCrudFunctions = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const user_schema_1 = __importDefault(require("../db_controllers/db_models/user_schema"));
const adminCrudFunctions = (modules) => {
    return {
        fetchAllUsers: async () => {
            const data = await modules.find();
            return data;
            // function to fetch all users ...
        },
        createUsers: async (name, email, department, password) => {
            let salt = bcrypt_1.default.genSaltSync(10);
            let hash2 = bcrypt_1.default.hashSync(password, salt);
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
        updateEmployess: async (id, name, email, department) => {
            let updateEmploye = await modules.findByIdAndUpdate(id, {
                name,
                email,
                department,
            }, {
                new: true,
                runvalidators: true,
            });
            return updateEmploye;
        },
        deleteEmploye: async (id) => {
            let deletedEmploye = await modules.findByIdAndDelete(new mongoose_1.Types.ObjectId(id));
            return deletedEmploye.name;
        },
        createDepartments: async (id, title, color, description) => {
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
        deleteDepartmetns: async (id) => {
            let deleteDepartment = await modules.findByIdAndDelete(id);
            return deleteDepartment.title;
        },
        updateDepartments: async (id, title, color, description) => {
            let updateDepartment = await modules.findByIdAndUpdate(id, {
                id,
                title,
                color,
                description,
            }, {
                new: true,
                runValidators: true,
            });
            return updateDepartment;
        },
        addAttendance: async (action, id) => {
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
                }
                else {
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
        retriveLogs: async (id) => {
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
                        date: 1,
                        first: { $arrayElemAt: ["$logs.firstnoon", 0] },
                        second: { $arrayElemAt: ["$logs.secondnoon", 0] },
                        users: { $arrayElemAt: ["$attendance", 0] },
                    },
                },
            ]);
            console.log(data);
            return data;
        },
        DailyReports: async (title, desc, deptId, type, date) => {
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
        departmentProjects: async (head_id, projectData) => {
            let { title, description, deadline, priority, teamMembers, todos } = projectData;
            console.log(title, description, deadline, priority, teamMembers, todos);
            let projectObj = new modules({
                head_id,
                title,
                deadline,
                description,
                priority,
                teamMembers,
                todos,
            });
            const DepartmentProjects = await projectObj.save();
            return DepartmentProjects;
        },
        fetchEmp: async (id) => {
            let admindata = await modules.findOne({ _id: id });
            let department = admindata.department;
            let employes = await user_schema_1.default.find({
                department: department,
            });
            return employes;
        },
        fetchHeadProjects: async (id) => {
            console.log("head id", id);
            let data = await modules.find({ head_id: id });
            console.log("data", data);
            return data;
        },
        assignTasks: async (employeeTaskts) => {
            console.log(employeeTaskts);
            let assigne = new modules(employeeTaskts);
            await assigne.save().then(async (data) => {
                return data;
            });
        },
        fetchTasks: async (id) => {
            let data = await modules.findOne({ projectId: id });
            return data;
        },
        updateassigenTasks: async (id, updatedProjTasks) => {
            await modules
                .findOneAndUpdate({
                projectId: id,
            }, {
                projectId: updatedProjTasks.projectId,
                headid: updatedProjTasks.headId,
                employeeTasks: updatedProjTasks.employeeTasks,
            })
                .then(async (data) => {
                console.log(data);
                return data;
            });
        },
        projectOverview: async (id) => {
            let data = await modules.aggregate([
                {
                    $match: { projectId: id },
                },
                {
                    $unwind: "$employeeTasks",
                },
                {
                    $lookup: {
                        from: "users",
                        let: { empId: "$employeeTasks.employee" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", { $toObjectId: "$$empId" }],
                                    },
                                },
                            },
                        ],
                        as: "emp_detail",
                    },
                },
                {
                    $unwind: "$emp_detail",
                },
                {
                    $lookup: {
                        from: "employee_sub_tasks",
                        let: {
                            empid: "$employeeTasks.employee",
                            taskid: "$employeeTasks.tasks.task_id",
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$user_id", "$$empid"] },
                                            { $eq: ["$project_id", id] },
                                            { $eq: ["$task_id", "$$taskid"] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "sub_task_doc",
                    },
                },
                {
                    $unwind: {
                        path: "$sub_task_doc",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: "$employeeTasks.employee",
                        name: { $first: "$emp_detail.name" },
                        tasks: {
                            $push: {
                                _id: "$employeeTasks._id",
                                task_id: "$employeeTasks.tasks.task_id",
                                title: "$employeeTasks.tasks.title",
                                priority: "$employeeTasks.tasks.priority",
                                duedate: "$employeeTasks.tasks.duedate",
                                status: "$employeeTasks.tasks.status",
                                user_subTaks: {
                                    $ifNull: ["$sub_task_doc.user_subTaks", []],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        emp_datas: {
                            _id: "$_id",
                            name: "$name",
                        },
                        tasks: 1,
                    },
                },
            ]);
            return data;
        },
    };
};
exports.adminCrudFunctions = adminCrudFunctions;
