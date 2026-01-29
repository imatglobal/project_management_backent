import express from "express";
const app = express();
const Router = express.Router();
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { admin_roles_models } from "../db_controllers/db_models/admin_roles_schema";
import tasks_module_it from "../db_controllers/db_models/task_schemas/tasks_schema";
import {
  addEmploye,
  createDepartments,
  deleteDepartments,
  deleteEmploye,
  Employe_logs,
  fetchDepartments,
  fetchUsers,
  read_reports,
  read_tasks,
  task_controller,
  updateAttendance,
  updateDepartments,
  updateEmplye,
  work_Reports,
} from "./task_controllers";
Router.post("/verify_authorization", (req: Request, res: Response) => {
  const { position, name, password } = req.body;
  if (position && name && password) {
    const saltrount = 10;
    const salt = bcrypt.genSaltSync(saltrount);
    const hash2 = bcrypt.hashSync(password, salt);
    const admin_obj = new admin_roles_models({
      position: position,
      name: name,
      password: hash2,
    });
    admin_obj
      .save()
      .then((data) => {
        if (data) {
          res.json({ position: data.position });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

Router.post("/add_task", (req: Request, res: Response) => {
  const task_Data = req.body;
  task_controller(task_Data, tasks_module_it)
    .then((data) => {
      if (data) res.json({ message: true });
    })
    .catch((error) => {
      console.log(error);
    });
});

Router.get("/get_kanban_task", (req: Request, res: Response) => {
  read_tasks(tasks_module_it).then((data) => {
    res.json(data);
  });
});

Router.get("/users", fetchUsers);
Router.post("/employes", addEmploye);
Router.delete("/deleteEmp/:id", deleteEmploye);
Router.put("/updateEmploye/:id", updateEmplye);

//departments
Router.post("/addDep", createDepartments);
Router.get("/departments", fetchDepartments);
Router.delete("/deleteDept/:id", deleteDepartments);
Router.put("/Editdepartments/:id", updateDepartments);

Router.post("/attendance", updateAttendance);
Router.get("/employe_log", Employe_logs);

Router.post("/Daily_reports", work_Reports);
Router.get("/reports", read_reports);
export default Router;
