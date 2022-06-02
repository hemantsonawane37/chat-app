const jwt = require("jsonwebtoken");
exports.sendToken = (user, statuscode, res) => {
  const Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie('token',Token, { maxAge: 50 * 5000 * 5000, httpOnly: true });
  res.status(statuscode).json({ user: user, token: Token });
};
