import User from "../models/User.js";
import jwt, { decode } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendMailTo } from "../utils/mail.js";

Tạo JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Không trả về password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
    });
    try {
      const mail = await sendMailTo(email, "aloha", "olaho");
      console.log(mail);
    } catch (error) {
      console.log(error);
    }
    res
      .status(201)
      .json({ message: "Đăng ký thành công, hãy xác thực email", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }
    const token = generateToken(user);

    res.json({
      message: "Đăng nhập thành công",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Xóa người dùng thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy email" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "300s",
    });
    user.token = token;

    await user.save();

    const link = `http://localhost:5173/auth/forgot-password/${token}`;
    await sendMailTo(email, "form-html", link);

    res.status(200).json({
      message: "link xác thực đã gửi đến email, vui lòng kiểm tra email",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (!decoded) {
      return res.status(400).json({ message: "token lỗi" });
    }

    const user = await User.findById(decoded.id);
    const exp = decoded.id.exp;

    if (!user) {
      return res
        .status(400)
        .json({ error: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // Mã hóa mật khẩu mới
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    // user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server, vui lòng thử lại" });
  }
};
