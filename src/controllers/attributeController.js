import Attribute from "../models/Attribute.js";

/**
 * Lấy tất cả thuộc tính (Màu sắc, Size) kèm giá trị (populate "values")
 */
export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find().populate({
      path: "values",
      select: "_id name", // Lấy cả _id và name từ ValueAttribute
    });

    res.status(200).json(attributes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Lấy thuộc tính theo ID (populate "values" với cả _id & name)
 */
export const getAttributeById = async (req, res) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id).populate({
      path: "values",
      select: "_id name", // Lấy cả _id và name từ ValueAttribute
    });

    if (!attribute) {
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    res.status(200).json(attribute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo thuộc tính mới (Màu sắc hoặc Size)
 */
export const createAttribute = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra xem thuộc tính đã tồn tại chưa
    const existingAttribute = await Attribute.findOne({ name });
    if (existingAttribute) {
      return res.status(400).json({ error: "Thuộc tính đã tồn tại" });
    }

    // Tạo thuộc tính mới
    const newAttribute = await Attribute.create({ name, values: [] });

    res.status(201).json({
      message: "Tạo thuộc tính thành công",
      attribute: newAttribute,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Cập nhật thuộc tính (chỉ cập nhật tên, không tự động thêm giá trị mới)
 */
export const updateAttribute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const attribute = await Attribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    // Cập nhật tên thuộc tính
    attribute.name = name || attribute.name;
    await attribute.save();

    res.status(200).json({
      message: "Cập nhật thuộc tính thành công",
      attribute,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Xóa thuộc tính (Xóa tất cả giá trị thuộc tính liên quan)
 */
export const deleteAttribute = async (req, res) => {
  try {
    const { id } = req.params;

    const attribute = await Attribute.findById(id);
    if (!attribute) {
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    // Xóa tất cả giá trị liên quan trước khi xóa thuộc tính
    await ValueAttribute.deleteMany({ _id: { $in: attribute.values } });

    // Xóa thuộc tính
    await Attribute.findByIdAndDelete(id);

    res.status(200).json({ message: "Xóa thuộc tính thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
