import Order from "../models/Oder.js";
import OrderDetail from "../models/OderDetail.js";
import Product from "../models/Product.js";

export const getOrderDetailsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderDetails = await OrderDetail.find({ orderId }).populate(
      "productId",
      "name basePrice imageUrl"
    );

    if (!orderDetails || orderDetails.length === 0) {
      return res
        .status(404)
        .json({ error: "Không có sản phẩm nào trong đơn hàng này" });
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrderDetail = async (req, res) => {
  try {
    const { orderId, productId, quantity, price } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    const orderDetail = await OrderDetail.create({
      orderId,
      productId,
      quantity,
      price,
    });

    res.status(201).json({
      message: "Sản phẩm đã được thêm vào đơn hàng",
      orderDetail,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, price } = req.body;

    const orderDetail = await OrderDetail.findById(id);
    if (!orderDetail) {
      return res.status(404).json({ error: "Không tìm thấy OrderDetail" });
    }

    orderDetail.quantity = quantity || orderDetail.quantity;
    orderDetail.price = price || orderDetail.price;
    await orderDetail.save();

    res.status(200).json({
      message: "Cập nhật OrderDetail thành công",
      orderDetail,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const orderDetail = await OrderDetail.findById(id);
    if (!orderDetail) {
      return res.status(404).json({ error: "Không tìm thấy OrderDetail" });
    }

    await OrderDetail.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa OrderDetail thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
