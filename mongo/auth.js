const jwt = require("jsonwebtoken");
const config = require("config");
const cookieParser = require("cookie-parser");

module.exports = function (req, res, next) {
  // Get the token from the "credentials" cookie
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next(); // Proceed to the next middleware/route
  } catch (err) {
    res.status(400).send("Invalid token.");
  }
};
