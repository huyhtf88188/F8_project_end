import mongoose from "mongoose";
import Brand from "../models/Brand.js";

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();

    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const id = req.params.id;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "không tìm thấy thương hiệu" });
    }
    res.status(200).json({
      message: "tìm kiếm thương hiệu thành công",
      brand,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBrand = async (req, res) => {
  try {
    const data = req.body;

    const newBrand = await Brand.findOne({ name: data.name });
    if (newBrand) {
      return res.status(400).json({ error: "thương hiệu đã tồn tại" });
    }

    const brand = await Brand.create(data);

    return res.status(201).json({
      message: "tạo thương hiệu thành công",
      brand,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const id = req.params.id;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "không tìm thấy thương hiệu" });
    }
    const data = req.body;
    const updatedBrand = await Brand.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json({
      message: "cập nhật thương hiệu thành cong",
      updatedBrand,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "không tìm thấy thương hiệu" });
    }
    await Brand.findByIdAndDelete(id);
    res.status(200).json({ message: "xóa thương hiệu thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
