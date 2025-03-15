import Attribute from "../models/Attribute.js";
import Product from "../models/Product.js";
import ValueAttribute from "../models/valueAttribute.js";
import Variant from "./../models/Variant.js";

export const getVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const variants = await Variant.find({ productId: productId })
      .populate("productId", "name")
      .populate("attributes.attributeId", "name")
      .populate("attributes.valueId", "name");

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

export const getAllVariant = async (req, res) => {
  try {
    const variants = await Variant.find();

    res.status(200).json(variants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo biến thể sản phẩm
export const createVariant = async (req, res) => {
  try {
    const { productId, attributes, stock, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra và xử lý attributes
    let processedAttributes = [];
    for (const attr of attributes) {
      const attribute = await Attribute.findById(attr.attributeId);
      const valueAttr = await ValueAttribute.findById(attr.valueId);

      if (!attribute || !valueAttr) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy thuộc tính hoặc giá trị." });
      }

      processedAttributes.push({
        attributeId: { _id: attribute._id, name: attribute.name },
        valueId: { _id: valueAttr._id, name: valueAttr.name },
        _id: attr._id,
      });
    }

    const variant = await Variant.create({
      productId,
      attributes: processedAttributes,
      stock,
      price,
    });

    product.variants.push(variant._id);
    await product.save();

    // Populate the variant to include attribute and value names
    const populatedVariant = await Variant.findById(variant._id)
      .populate("attributes.attributeId", "name")
      .populate("attributes.valueId", "name");

    res.status(201).json({
      message: "Tạo biến thể sản phẩm thành công",
      variant: populatedVariant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const updateVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const { stock, price, attributes } = req.body;
    console.log(req.body);

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
