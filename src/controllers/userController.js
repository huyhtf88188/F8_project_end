import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Tạo JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Lấy tất cả người dùng (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Không trả về password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng ký người dùng
export const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });

    // Trả về token
    // const token = generateToken(newUser);
    res.status(201).json({ message: "Đăng ký thành công", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng nhập người dùng
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }
    // Tạo token
    const token = generateToken(user);

    // Trả về thông tin đăng nhập
    res.json({
      message: "Đăng nhập thành công",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy thông tin người dùng (đã đăng nhập)
// export const getProfile = async (req, res) => {
//   try {
//     const id = req.user.id;
//     const user = await User.findById(id, "-password"); // Không trả về password
//     if (!user) {
//       return res.status(404).json({ error: "Không tìm thấy người dùng" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { name, phone },
      { new: true, select: "-password" }
    );

    res.status(200).json({ message: "Cập nhật thành công", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa người dùng (Admin)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
