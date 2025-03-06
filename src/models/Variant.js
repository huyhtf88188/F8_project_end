import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      // required: true,
    },
    attributes: [
      {
        attributeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attribute",
        },
        valueId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ValueAttribute",
        },
      },
    ],
    stock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

variantSchema.pre(/^find/, function (next) {
  this.populate("attributes.attributeId", "name"); // Chỉ lấy field `name` từ `Attribute`
  next();
});

const Variant = mongoose.model("Variant", variantSchema);

export default Variant;
