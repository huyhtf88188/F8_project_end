import slugify from "slugify";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Variant from "../models/Variant.js";

import Category from "../models/Category.js";

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isHidden: false })
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate("variants");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate("variants");

    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      basePrice,
      totalStock,
      imageUrl,
      sex,
      brandId,
      categoryId,
    } = req.body;

    // Kiểm tra Brand và Category có tồn tại không
    const brand = await Brand.findById(brandId);
    if (!brand)
      return res.status(404).json({ error: "Thương hiệu không tồn tại" });

    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ error: "Danh mục không tồn tại" });

    // Tạo slug từ tên sản phẩm
    const slug = slugify(name, { lower: true });

    // Tạo sản phẩm mới
    const product = await Product.create({
      name,
      description,
      basePrice,
      totalStock,
      imageUrl,
      sex,
      brandId,
      categoryId,
      slug,
    });

    res.status(201).json({ message: "Sản phẩm đã được tạo", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Nếu cập nhật tên, cần tạo lại slug
    if (updateData.name) {
      updateData.slug = slugify(updateData.name, { lower: true });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res
      .status(200)
      .json({ message: "Cập nhật sản phẩm thành công", updatedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa sản phẩm (ẩn thay vì xóa cứng)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isHidden: true, deletedAt: new Date() },
      { new: true }
    );

    if (!deletedProduct) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json({ message: "Sản phẩm đã được ẩn", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
