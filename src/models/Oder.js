import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["COD"], required: true },
    orderDetails: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
