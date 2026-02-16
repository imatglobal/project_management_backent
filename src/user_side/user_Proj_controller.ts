import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { user_project_controller } from "./user_controller";
import departmentProjectsModle from "../db_controllers/db_models/admin_side/department_projects";
import assignedTasksModel from "../db_controllers/db_models/admin_side/assigen-tasks";
interface IdecodedToken {
  id: ObjectId;
  iat: number;
}
export const emp_included_proj = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let id: any = req.headers.authorization;
    let decodedToken: any = await jwt.verify(id, "secret_key");
    let employee_assigned_proj = await user_project_controller(
      departmentProjectsModle,
    );
    let user_assigned_proj =
      await employee_assigned_proj.user_assigned_projects(decodedToken.id);
    res.status(200).json(user_assigned_proj);
  } catch (error) {
    return next(error);
  }
};

export const emp_proj_tasks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let id: any = req.params.projectId;
    let decodedToken: any = req.headers.authorization;
    let encodedToken: any = jwt.verify(decodedToken, "secret_key");
    // console.log("proj_id", id, "emp_id", encodedToken.id);
    let assigned_tasks_for_emp =
      await user_project_controller(assignedTasksModel);
    let employe_proj_tasks =
      await assigned_tasks_for_emp.employee_assigned_tasks(encodedToken.id, id);
    res.status(200).json(employe_proj_tasks);
  } catch (error) {
    return error;
  }
};
