export const user_project_controller = async (modules: any) => {
  return {
    user_assigned_projects: async (id: string) => {
      let data = await modules.find({ "teamMembers.userId": id });
      return data;
    },

    employee_assigned_tasks: async (id: string, projectId: string) => {
      // console.log(id, projectId);
      let data = await modules.aggregate([
        {
          $unwind: "$employeeTasks",
        },
        {
          $match: {
            projectId: projectId,
            "employeeTasks.employee": id,
          },
        },
        {
          $project: {
            _id: 0,
            headId: 1,
            "employeeTasks.tasks": 1,
          },
        },
      ]);

      return data;
    },
  };
};
