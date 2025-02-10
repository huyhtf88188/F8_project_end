import Order from "../models/Oder.js";
import Product from "../models/Product.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email phone");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email phone")
      .populate("orderDetails.productId", "name basePrice imageUrl");

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo đơn hàng (User)
export const createOrder = async (req, res) => {
  try {
    const { userId, orderDetails, paymentMethod } = req.body;

    // Kiểm tra danh sách sản phẩm có hợp lệ không
    let totalPrice = 0;
    for (let item of orderDetails) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Sản phẩm với ID ${item.productId} không tồn tại` });
      }
      totalPrice += product.basePrice * item.quantity;
    }

    // Tạo đơn hàng
    const newOrder = await Order.create({
      userId,
      orderDetails,
      totalPrice,
      paymentMethod,
    });

    res.status(201).json({
      message: "Tạo đơn hàng thành công",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật đơn hàng (Admin)
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Cập nhật đơn hàng thành công",
      updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
