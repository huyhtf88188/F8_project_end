import mongoose from "mongoose";

const valueAttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const ValueAttribute = mongoose.model("ValueAttribute", valueAttributeSchema);

export default ValueAttribute;
