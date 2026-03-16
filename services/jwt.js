const jwt = require("jsonwebtoken");

const generateToken = (user, type = 'user') => {
  if (!user) throw new Error("Cannot generate token for null user");

  const payload = {
    _id: user._id,
    email: user.email,
    type: type // 'user' or 'admin'
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token)
    return res.status(401).json({ status: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.admin = decoded; // For admin routes compatibility
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: "Invalid Token" });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.admin || req.admin.type !== 'admin') {
    return res.status(403).json({ 
      status: false, 
      message: "Access denied. Admin privileges required." 
    });
  }
  next();
};

module.exports = { generateToken, verifyToken, isAdmin };