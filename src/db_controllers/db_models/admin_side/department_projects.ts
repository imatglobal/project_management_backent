import mongoose, { Schema, trusted } from "mongoose";
import { truncate } from "node:fs";
import { title } from "node:process";

interface IteamMembers {
  userId: string;
  name: string;
  role: string;
}

interface Itodolist {
  //   id: string;
  title: string;
  dueDate: string;
  status: "pending" | "inprogress" | "completed";
  priority: "low" | "medium" | "high";
}

interface Iproject {
  head_id: String;
  title: String;
  deadline: string;
  description: string;
  priority: "low" | "medium" | "high";
  teamMembers: IteamMembers[];
  todos: Itodolist[];
}

let teamMembers = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
});

let todoList = new Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    required: true,
  },
  dueDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "inprogress", "completed"],
    required: true,
  },
});

const departmentProjectsSchema = new Schema<Iproject>({
  head_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Critical"],
    required: true,
  },
  teamMembers: [teamMembers],
  todos: [todoList],
});

const departmentProjectsModle = mongoose.model(
  "DepartmentProjects",
  departmentProjectsSchema,
);

export default departmentProjectsModle;
