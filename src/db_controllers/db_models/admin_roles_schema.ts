import mongoose, { Schema } from "mongoose";
interface Iadmin_roles {
  position: string;
  name: string;
  department: string;
  password: string;
}

const admin_roles_schema = new Schema({
  position: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

export const admin_roles_models = mongoose.model<Iadmin_roles>(
  "admin_roles",
  admin_roles_schema,
);
