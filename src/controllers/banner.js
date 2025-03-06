import Banner from "../models/banner.js";

// Lấy danh sách banner
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({
      message: "Lấy danh sách banner thành công",
      banners,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo banner mới
export const createBanner = async (req, res) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      return res
        .status(400)
        .json({ error: "Tiêu đề và ảnh banner là bắt buộc" });
    }

    const newBanner = await Banner.create({ name, link });

    res.status(201).json({
      message: "Tạo banner thành công",
      newBanner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ error: "Không tìm thấy banner" });
    }

    await Banner.findByIdAndDelete(id);

    res.status(200).json({ message: "Xóa banner thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
