import Attribute from "../models/Attribute.js";
import ValueAttribute from "../models/valueAttribute.js";

/**
 * Lấy tất cả các giá trị thuộc tính (Màu sắc, Size)
 */
export const getValueAttributes = async (req, res) => {
  try {
    const values = await ValueAttribute.find();
    res.status(200).json(values);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giá trị", error });
  }
};

/**
 * 🔥 Lấy giá trị thuộc tính theo ID
 */
export const getValueAttributeById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(`🔍 Đang tìm ValueAttribute ID: ${id}`);

    const valueAttribute = await ValueAttribute.findById(id);

    if (!valueAttribute) {
      console.log("❌ Không tìm thấy ValueAttribute!");
      return res
        .status(404)
        .json({ message: "Không tìm thấy giá trị thuộc tính" });
    }

    console.log("✅ ValueAttribute tìm thấy:", valueAttribute);
    res.status(200).json(valueAttribute);
  } catch (error) {
    console.error("🔥 Lỗi khi lấy giá trị thuộc tính:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Tạo giá trị thuộc tính mới và cập nhật vào `Attribute`
 */
export const createValueAttribute = async (req, res) => {
  try {
    const { id, name } = req.body; // `id` là `_id` của `Attribute`

    // Kiểm tra xem Attribute có tồn tại không
    const attribute = await Attribute.findById(id);
    if (!attribute) {
      console.log("❌ Không tìm thấy Attribute!");
      return res.status(404).json({ message: "Không tìm thấy thuộc tính" });
    }

    // Kiểm tra nếu giá trị đã tồn tại trong `ValueAttribute`
    let value = await ValueAttribute.findOne({ name });

    if (value) {
      // Nếu giá trị đã tồn tại, chỉ thêm vào `Attribute.values` nếu chưa có
      if (!attribute.values.includes(value._id)) {
        attribute.values.push(value._id);
        await attribute.save();
      }
      return res.status(200).json({ message: "Giá trị đã tồn tại", value });
    }

    // ✅ Tạo giá trị mới trong `ValueAttribute`
    value = await ValueAttribute.create({ name });

    // ✅ Cập nhật `values` của `Attribute`, thêm `_id` vào danh sách
    attribute.values.push(value._id);
    await attribute.save();

    res.status(201).json({ message: "Tạo giá trị thành công", value });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo giá trị", error });
  }
};

/**
 * Xóa giá trị thuộc tính (`ValueAttribute`) và xóa khỏi `Attribute.values`
 */ export const deleteValueAttribute = async (req, res) => {
  try {
    const { id } = req.params; // ✅ `id` là `valueId`
    const { attributeId } = req.body; // ✅ Nhận `attributeId` từ `body`

    console.log("📥 Dữ liệu nhận từ Frontend:", req.body); // ✅ Debug `req.body`
    console.log(
      `🗑️ Xóa ValueAttribute ID: ${id} khỏi Attribute ID: ${attributeId}`
    );

    if (!attributeId) {
      console.log("❌ `attributeId` bị thiếu trong `req.body`!");
      return res
        .status(400)
        .json({ error: "Thiếu `attributeId` trong request!" });
    }

    const attribute = await Attribute.findById(attributeId);
    if (!attribute) {
      console.log("❌ Không tìm thấy Attribute!");
      return res.status(404).json({ error: "Không tìm thấy thuộc tính" });
    }

    if (!attribute.values.includes(id)) {
      console.log("❌ ValueAttribute không tồn tại trong danh sách values!");
      return res
        .status(404)
        .json({ error: "Giá trị thuộc tính không tồn tại" });
    }

    attribute.values = attribute.values.filter((v) => v.toString() !== id);
    await attribute.save();

    const deletedValue = await ValueAttribute.findByIdAndDelete(id);
    if (!deletedValue) {
      console.log("❌ Không tìm thấy giá trị thuộc tính trong DB!");
      return res
        .status(404)
        .json({ error: "Không tìm thấy giá trị thuộc tính" });
    }

    console.log("✅ Xóa thành công!");
    res
      .status(200)
      .json({ message: "Xóa giá trị biến thể thành công", attribute });
  } catch (error) {
    console.error("🔥 Lỗi khi xóa giá trị biến thể:", error);
    res.status(500).json({ error: error.message });
  }
};
