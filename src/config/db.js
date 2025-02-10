import mongoose from "mongoose";
import env from "./config.js";

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(env.DB_URI);
    console.log(
      `Connected MongoDB: mongodb://${connected.connection.host}:${connected.connection.port}/${connected.connection.name}`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
