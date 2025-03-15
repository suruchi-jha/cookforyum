const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

