import Product from "../models/Product.js";
import Variant from "./../models/Variant.js";

export const getVariantsByProductId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const variants = await Variant.find({ id })
      .populate("productId", "name")
      .populate("attributes.attributeId", "name");

    if (!variants || variants.length === 0) {
      return res
        .status(404)
        .json({ error: "Không có biến thể nào cho sản phẩm này" });
    }

    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo biến thể sản phẩm
export const createVariant = async (req, res) => {
  try {
    const { productId, attributes, stock, price } = req.body;

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra xem các thuộc tính có hợp lệ không
    // for (let attr of attributes) {
    //   const attribute = await Attribute.findById(attr.attributeId);
    //   if (!attribute) {
    //     return res
    //       .status(404)
    //       .json({
    //         error: `Thuộc tính với ID ${attr.attributeId} không tồn tại`,
    //       });
    //   }
    // }

    // Tạo Variant mới
    const variant = await Variant.create({
      productId,
      attributes,
      stock,
      price,
    });

    res.status(201).json({
      message: "Tạo biến thể sản phẩm thành công",
      variant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật biến thể sản phẩm
export const updateVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const { stock, price, attributes } = req.body;

    const variant = await Variant.findById(productId);
    if (!variant) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy biến thể sản phẩm" });
    }

    // Kiểm tra nếu có cập nhật thuộc tính
    if (attributes) {
      //   for (let attr of attributes) {
      //     const attribute = await Attribute.findById(attr.attributeId);
      //     if (!attribute) {
      //       return res
      //         .status(404)
      //         .json({
      //           error: `Thuộc tính với ID ${attr.attributeId} không tồn tại`,
      //         });
      //     }
      //   }
      variant.attributes = attributes;
    }

    // Cập nhật tồn kho và giá
    variant.stock = stock || variant.stock;
    variant.price = price || variant.price;
    await variant.save();

    res.status(200).json({
      message: "Cập nhật biến thể sản phẩm thành công",
      variant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa biến thể sản phẩm
export const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await Variant.findById(id);
    if (!variant) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy biến thể sản phẩm" });
    }

    await Variant.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa biến thể sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
