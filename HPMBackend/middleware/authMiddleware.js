import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔒 Verify Token Middleware
export const authMiddleware = async (req, res, next) => {
  try {
    let token;

    // check token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // if no token
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from DB (without password)
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// 🛡️ Admin Only Middleware
export const adminOnly = (req, res, next) => {
  try {
    if (req.user && req.user.role === "ADMIN") {
      next();
    } else {
      return res.status(403).json({ msg: "Admin access only" });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};