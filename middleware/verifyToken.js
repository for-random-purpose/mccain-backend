const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if(!authHeader) {
    return res.status(401).json({ status: { code: 401, message: "Bad Request!" }, error: "Authorization header is required" });
  }
  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Authentication token is required." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Cannot verify the token")
      return res.status(403).json({ error: "Invalid or Expired Token" })
    }

    req.user = user
    next()
  })
}
module.exports = verifyToken;