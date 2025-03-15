import mongoose from "mongoose";
import Variant from "./Variant.js";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Variant",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.methods.calculateTotalPrice = async function () {
  let total = 0;
  for (const item of this.items) {
    const variant = await Variant.findById(item.variantId);
    if (variant) {
      total += variant.price * item.quantity;
    }
  }
  this.totalPrice = total;
  return this.totalPrice;
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
