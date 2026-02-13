import mongoose, { Schema } from "mongoose";

interface Iuser {
  name: string;
  email: string;
  department: string;
  password: string;
  active: boolean;
}

const new_user_schemas = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  department: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  active: {
    type: Boolean,
    require: true,
  },
});

const user_model = mongoose.model<Iuser>("users", new_user_schemas);
export default user_model;
