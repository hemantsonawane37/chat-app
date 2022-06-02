const jwt = require("jsonwebtoken");
const User = require("../models/userModule");
const asyncHandler = require("../ErrorHandlers/asyncHandler");
const Errorresponse = require("../ErrorHandlers/Errorresponse");

exports.IsLogin = asyncHandler(async (req, res, next) => {
  if (!req.cookies.token) {
    next(new Errorresponse("User Is Not Login", 400));
    return;
  }
  const Token = req.cookies.token;
  const value = jwt.verify(Token, process.env.JWT_SECRET);
  const user = await User.findById(value.id);
  if (!user) {
    next(new Errorresponse("User Not Found", 400));
    return;
  }
  req.user = user;
  next();
});
