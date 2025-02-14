import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "member",
      enum: ["member", "admin", "superAdmin"],
    },
    token: {
      type: String,
    },
    exp: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
