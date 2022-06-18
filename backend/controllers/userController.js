const User = require("../models/userModule");
const CatchAsyncError = require("../ErrorHandlers/asyncHandler");
const Errorrspone = require("../ErrorHandlers/Errorresponse");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../ErrorHandlers/asyncHandler");
const { sendToken } = require("../util/sendToken");
const cloudinary = require("cloudinary").v2;

exports.RegisterUser = CatchAsyncError(async (req, res, next) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return next(new Errorrspone("please Enter all fields", 400));
  }

  const isuser = await User.findOne({ email });
  if (isuser) {
    return next(new Errorrspone("user already exist !", 400));
  }

  if (Array.isArray(pic) && pic.length) {
    const result = await cloudinary.uploader.upload(pic[0], {
      folder: "chat application/profile pic",
    });
    const user = await User.create({
      name,
      email,
      password,
      pic: { url: result.url, public_id: result.public_id },
    });
    sendToken(user, 201, res);
    return;
  } else {
    const user = await User.create({
      name,
      email,
      password,
    });
    sendToken(user, 201, res);
  }
});

exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Errorrspone("please Enter all fields", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new Errorrspone("wrong email or password enter", 400));
  }

  if (!(await user.matchPassword(password))) {
    return next(new Errorrspone("wrong email or password enter", 400));
  }

  user.password = undefined;
  sendToken(user, 200, res);
});

exports.AllUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
 
  res.status(200).json(users)
});
