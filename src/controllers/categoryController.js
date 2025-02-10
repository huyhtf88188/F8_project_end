import Category from "../models/Category.js";

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "không tìm thấy danh mục" });
    }
    res.status(200).json({
      message: "tìm kiếm danh mục thành công",
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const data = req.body;

    const newCategory = await Category.findOne({ name: data.name });
    if (newCategory) {
      return res.status(400).json({ error: "danh mục đã tồn tại" });
    }

    const category = await Category.create(data);

    return res.status(201).json({
      message: "tạo danh mục thành công",
      category,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "không tìm thấy danh mục" });
    }
    const data = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json({
      message: "cập nhật danh mục thành công",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "không tìm thấy danh mục" });
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
