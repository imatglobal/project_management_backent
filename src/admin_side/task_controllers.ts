import { error } from "node:console";
import { adminCrudFunctions } from "./admin.crud";
import user_model from "../db_controllers/db_models/user_schema";
import { Request, Response, NextFunction } from "express";
import departmentModel from "../db_controllers/db_models/admin_side/department_schema";

import jwt from "jsonwebtoken";
import AttendanceModel from "../db_controllers/db_models/attendance_schema";
import DailyReportsModel from "../db_controllers/db_models/task_schemas/Daily_reports";
export const task_controller = (task_data: any, task_models: any) => {
  return new Promise((resolve, rejects) => {
    const task_obj = new task_models(task_data);
    console.log(task_data);
    task_obj
      .save()
      .then((data: string) => {
        console.log(data);
        if (data) resolve(true);
      })
      .catch((error: Error) => {
        rejects(error);
      });
  });
};

export const read_tasks = (task_module: any) => {
  return new Promise((resolve, reject) => {
    task_module
      .find()
      .then((data: any) => {
        resolve(data);
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
};

export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const usersFetch = adminCrudFunctions(user_model);
  const data = await usersFetch.fetchAllUsers();
  res.status(200).json(data);
};

export const addEmploye = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, department, password } = req.body;
  const employeCreate = adminCrudFunctions(user_model);
  let empObj = await employeCreate.createUsers(
    name,
    email,
    department,
    password,
  );
  res.status(200).json(empObj.name);
};

export const deleteEmploye = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const employeDelete = adminCrudFunctions(user_model);
  let deletedEmploye = await employeDelete.deleteEmploye(id);
  res.status(200).json(deletedEmploye);
};

export const updateEmplye = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, department } = req.body;
  const id = req.params.id;
  const updateEmploye = adminCrudFunctions(user_model);
  let updatedData = await updateEmploye.updateEmployess(
    id,
    name,
    email,
    department,
  );
  res.status(200).json(updateEmploye);
};

export const createDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id, title, color, description } = req.body;
  const createDepartments = adminCrudFunctions(departmentModel);
  let departmentObj = await createDepartments.createDepartments(
    id,
    title,
    color,
    description,
  );
  console.log("after successfully added", departmentObj);
  res.status(200).json(departmentObj);
};

export const fetchDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const retriveDepartments = adminCrudFunctions(departmentModel);
  let data = await retriveDepartments.fetchDepartments();
  console.log(data);
  res.status(200).json(data);
};

export const deleteDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const deleteDepartments = adminCrudFunctions(departmentModel);
  let deleteDepartment = await deleteDepartments.deleteDepartmetns(id);
  res.status(200).json(deleteDepartment);
};

export const updateDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const { title, color, description } = req.body;
  const updateDepartments = adminCrudFunctions(departmentModel);
  let updateDep_data = await updateDepartments.updateDepartments(
    id,
    title,
    color,
    description,
  );
  res.json(200).json(updateDep_data);
};

export const updateAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: any = req.headers.authorization?.split(" ")[1];
  const decodedToken: any = jwt.verify(token, "secret_key");
  const id = decodedToken.id;
  const { userId, action } = req.body;
  const addAttendance = adminCrudFunctions(AttendanceModel);
  let addattendance = await addAttendance.addAttendance(action, id);
  res.status(200).json({ message: "Attendance updated successfully" });
};

export const Employe_logs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token: any = req.headers.authorization?.split(" ")[1];
  const decodedToken: any = jwt.verify(token, "secret_key");
  let id = decodedToken.id;
  let retrivLoegs = adminCrudFunctions(AttendanceModel);
  let logs = await retrivLoegs.retriveLogs(id);
  res.status(200).json(logs);
};

export const work_Reports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, desc, deptId, type, date } = req.body;
  // console.log(title, desc, deptId, type, date);
  const workReports = adminCrudFunctions(DailyReportsModel);
  let Dailyrepo = await workReports.DailyReports(
    title,
    desc,
    deptId,
    type,
    date,
  );

  console.log(Dailyrepo);
  res.status(200).json({ msg: "report added successfully" });
};

export const read_reports = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const readReports = adminCrudFunctions(DailyReportsModel);
  let data = await readReports.readReports();
  res.status(200).json(data);
};
