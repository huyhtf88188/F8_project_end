import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Variant from "../models/Variant.js";

// Lấy thông tin giỏ hàng của người dùng
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "name imageUrl description",
      })
      .populate({
        path: "items.variantId",
        populate: {
          path: "attributes.attributeId",
          select: "name price",
        },
      })
      .populate({
        path: "items.variantId",
        populate: {
          path: "attributes.valueId",
          select: "name",
        },
      });

    if (!cart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, variantId, quantity } = req.body;
    console.log(productId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const variant = await Variant.findById(variantId);
    if (!variant) {
      return res.status(404).json({ error: "Biến thể không tồn tại" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId: userId, items: [] });
    }

    const cartItem = cart.items.find(
      (item) => item.variantId.toString() === variantId
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, quantity, price: variant.price });
    }

    await cart.calculateTotalPrice();
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { variantId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    const cartItem = cart.items.find(
      (item) => item.variantId.toString() === variantId
    );
    if (!cartItem) {
      return res
        .status(404)
        .json({ error: "Sản phẩm không tồn tại trong giỏ hàng" });
    }

    cartItem.quantity = quantity;
    await cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { variantId } = req.body;

    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" });
    }

    cart.items = cart.items.filter(
      (item) => item.variantId.toString() !== variantId
    );
    await cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCart = async (id) => {
  try {
    let cart = {
      userId: id,
    };

    cart.items = [];
    cart.totalPrice = 0;
    const result = await Cart.create(cart);
    return result;
  } catch (error) {
    console.log(error);
  }
};
