import mongoose from "mongoose";
import slugify from "slugify";
import Product from "../models/Product.js";
import Brand from "../models/Brand.js";
import Variant from "../models/Variant.js";
import Category from "../models/Category.js";
import Attribute from "../models/Attribute.js";
import ValueAttribute from "../models/valueAttribute.js";

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isHidden: false })
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate({
        path: "variants",
        populate: {
          path: "attributes.valueId",
          select: "name",
        },
      });

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
      .populate({
        path: "variants",
        populate: {
          path: "attributes.valueId",
          select: "name",
        },
      });

    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    product.totalStock = product.variants?.reduce(
      (sum, v) => sum + (v.stock || 0),
      0
    );

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      basePrice,
      brandId,
      categoryId,
      attributes,
      imageUrl,
      sex,
      stock,
      variants,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (
      !name ||
      !description ||
      !basePrice ||
      !imageUrl ||
      !brandId ||
      !categoryId ||
      !stock
    ) {
      return res.status(400).json({ error: "Dữ liệu đầu vào không hợp lệ." });
    }

    // Xử lý attributes nếu có (dùng để tạo biến thể mặc định)
    let processedAttributes = [];
    if (Array.isArray(attributes) && attributes.length > 0) {
      for (const attr of attributes) {
        // Kiểm tra xem attr có đúng định dạng không
        if (!attr.attributeId || !attr.valueId) {
          return res
            .status(400)
            .json({ error: "Dữ liệu thuộc tính không hợp lệ." });
        }

        const attribute = await Attribute.findById(attr.attributeId);
        const valueAttr = await ValueAttribute.findById(attr.valueId); // Sửa lại từ attr.value thành attr.valueId

        if (!attribute || !valueAttr) {
          return res
            .status(404)
            .json({ error: "Không tìm thấy thuộc tính hoặc giá trị." });
        }

        processedAttributes.push({
          attributeId: { _id: attribute._id, name: attribute.name },
          valueId: { _id: valueAttr._id, name: valueAttr.name },
        });
      }
    }

    // Tạo sản phẩm
    const product = new Product({
      name,
      description,
      basePrice,
      totalStock: stock,
      brandId,
      categoryId,
      sex: sex || "unisex",
      imageUrl: imageUrl || "https://demofree.sirv.com/nope-not-here.jpg",
      variants: [],
    });
    await product.save();

    // Tạo biến thể mặc định từ `attributes` nếu có
    let variantIds = [];
    if (processedAttributes.length > 0) {
      const defaultVariant = new Variant({
        productId: product._id,
        attributes: processedAttributes,
        stock,
        price: basePrice,
      });
      const savedVariant = await defaultVariant.save();
      variantIds.push(savedVariant._id);
    }

    // Xử lý danh sách biến thể (`variants`) nếu có
    if (Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        const {
          attributes: variantAttrs,
          stock: variantStock,
          price,
        } = variant;

        if (
          !variantStock ||
          !price ||
          !Array.isArray(variantAttrs) ||
          variantAttrs.length === 0
        ) {
          return res
            .status(400)
            .json({ error: "Dữ liệu biến thể không hợp lệ." });
        }

        let processedVariantAttributes = [];
        for (const attr of variantAttrs) {
          // Kiểm tra xem attr có đúng định dạng không
          if (!attr.attributeId || !attr.valueId) {
            return res
              .status(400)
              .json({ error: "Dữ liệu thuộc tính không hợp lệ." });
          }

          const attribute = await Attribute.findById(attr.attributeId);
          const valueAttr = await ValueAttribute.findById(attr.valueId); // Sửa lại từ attr.value thành attr.valueId

          if (!attribute || !valueAttr) {
            return res
              .status(404)
              .json({ error: "Không tìm thấy thuộc tính hoặc giá trị." });
          }

          processedVariantAttributes.push({
            attributeId: { _id: attribute._id, name: attribute.name },
            valueId: { _id: valueAttr._id, name: valueAttr.name },
          });
        }

        const newVariant = new Variant({
          productId: product._id,
          attributes: processedVariantAttributes,
          stock: variantStock,
          price,
        });

        const savedVariant = await newVariant.save();
        variantIds.push(savedVariant._id);
      }
    }

    // Cập nhật danh sách biến thể vào sản phẩm
    if (variantIds.length > 0) {
      product.variants = variantIds;
      await product.save();
    }

    // Populate dữ liệu để trả về
    const populatedProduct = await Product.findById(product._id)
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate({
        path: "variants",
        populate: [
          { path: "attributes.attributeId", select: "name" },
          { path: "attributes.valueId", select: "name" },
        ],
      });

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      product: populatedProduct,
      variants: variantIds,
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi server: " + error.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = req.body;

    // 📌 Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    console.log("🔍 Đang cập nhật sản phẩm:", product._id);

    // 📌 Cập nhật thông tin sản phẩm
    if (updateData.name) {
      product.name = updateData.name;
      product.slug = slugify(updateData.name, { lower: true });
    }
    if (updateData.basePrice !== undefined)
      product.basePrice = updateData.basePrice;
    if (updateData.stock !== undefined) product.totalStock = updateData.stock;
    if (updateData.brandId) product.brandId = updateData.brandId;
    if (updateData.categoryId) product.categoryId = updateData.categoryId;
    if (updateData.sex) product.sex = updateData.sex;
    if (updateData.imageUrl) product.imageUrl = updateData.imageUrl;

    // 📌 Kiểm tra và cập nhật danh sách biến thể (variants)
    if (Array.isArray(updateData.variants)) {
      console.log("🔄 Cập nhật danh sách biến thể...");

      // Xóa tất cả biến thể cũ
      await Variant.deleteMany({ productId: product._id });

      let newVariants = [];

      for (const variant of updateData.variants) {
        const { attributes, stock, price } = variant;

        if (
          !attributes ||
          !Array.isArray(attributes) ||
          attributes.length === 0
        ) {
          return res
            .status(400)
            .json({ error: "Dữ liệu biến thể không hợp lệ." });
        }

        let processedAttributes = [];
        for (const attr of attributes) {
          const attribute = await Attribute.findById(attr.attributeId);
          const valueAttr = await ValueAttribute.findById(attr.valueId);
          console.log(attr.valueId);

          if (!attribute || !valueAttr) {
            return res
              .status(404)
              .json({ error: "Không tìm thấy thuộc tính hoặc giá trị." });
          }

          processedAttributes.push({
            attributeId: { _id: attribute._id, name: attribute.name },
            valueId: { _id: valueAttr._id, name: valueAttr.name },
          });
        }

        const newVariant = new Variant({
          productId: product._id,
          attributes: processedAttributes,
          stock,
          price,
        });

        const savedVariant = await newVariant.save();
        newVariants.push(savedVariant._id);
      }

      product.variants = newVariants;
    }

    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .populate({
        path: "variants",
        populate: [
          { path: "attributes.attributeId", select: "name" },
          { path: "attributes.valueId", select: "name" },
        ],
      });

    res.status(200).json({
      message: "Cập nhật sản phẩm thành công",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật sản phẩm:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa sản phẩm (ẩn thay vì xóa cứng)
export const softdeleteProduct = async (req, res) => {
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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }

    res
      .status(200)
      .json({ message: "Sản phẩm đã bị xóa vĩnh viễn", deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query không hợp lệ" });
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" },
      isHidden: false,
    })
      .populate("brandId", "name")
      .populate("categoryId", "name");

    res.status(200).json({ results: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
