import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connect_db() {
  await mongoose.connect("mongodb://localhost:27017/").then((data) => {
    try {
      console.log("db conneted");
    } catch (error) {
      console.log(error);
    }
  });
}

export default connect_db;
