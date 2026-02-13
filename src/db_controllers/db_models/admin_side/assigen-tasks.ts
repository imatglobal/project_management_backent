import mongoose, { Schema } from "mongoose";

interface Itasks {
  employee: string;
  tasks: {
    task_id: string;
    title: string;
    priority: string;
    duedate: string;
    status: string;
  };
}

interface IassignedTasks {
  projectId: string;
  headId: string;
  employeeTasks: Itasks[];
}

const tasksSchema = new Schema<Itasks>({
  employee: {
    type: String,
    require: true,
  },
  tasks: {
    task_id: {
      type: String,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    priority: {
      type: String,
      require: true,
    },
    duedate: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
  },
});

const assignedTasksSchema = new Schema<IassignedTasks>({
  projectId: {
    type: String,
    require: true,
  },
  headId: {
    type: String,
    require: true,
  },
  employeeTasks: {
    type: [tasksSchema],
    require: true,
  },
});

const assignedTasksModel = mongoose.model("AssignedTasks", assignedTasksSchema);
export default assignedTasksModel;
