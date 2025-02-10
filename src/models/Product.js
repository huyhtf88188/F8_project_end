import mongoose from "mongoose";
import slugMiddleware from "../middlewares/slugMiddleware.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
    },
    totalStock: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: "https://demofree.sirv.com/nope-not-here.jpg",
    },
    sex: {
      type: String,
      required: true,
      enum: ["male", "unisex", "female"],
      default: "unisex",
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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
    variants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(slugMiddleware("name", "slug"));

const Product = mongoose.model("Product", productSchema);

export default Product;
