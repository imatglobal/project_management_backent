import mongoose, { Schema } from "mongoose";

interface IDailyReports {
  date: string;
  title: string;
  desc: string;
  deptId: string;
}

const daily_reports_schema = new Schema({
  date: {
    require: true,
    type: String,
  },
  title: {
    require: true,
    type: String,
  },
  desc: {
    require: true,
    type: String,
  },
  deptId: {
    require: true,
    type: String,
  },
});

const DailyReportsModel = mongoose.model<IDailyReports>(
  "DailyReports",
  daily_reports_schema,
);

export default DailyReportsModel;
