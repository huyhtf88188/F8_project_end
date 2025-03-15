import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.token;
  }
  if (!token) {
    return res
      .status(401)
      .json({ error: "Không có token, truy cập bị từ chối" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ error: "Không tìm thấy người dùng" });
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ error: "Token không hợp lệ" });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Không được phép, yêu cầu quyền admin" });
  }
};
