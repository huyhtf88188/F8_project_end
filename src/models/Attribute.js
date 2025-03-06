import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    values: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "ValueAttribute" }],
      default: [], // Khởi tạo mặc định là một mảng rỗng
    },
  },
  { timestamps: true, versionKey: false }
);

const Attribute = mongoose.model("Attribute", attributeSchema);

export default Attribute;
