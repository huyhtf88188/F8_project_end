import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
