import mongoose from "mongoose";
import slugMiddleware from "../middlewares/slugMiddleware.js";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

brandSchema.plugin(slugMiddleware("name", "slug"));

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
