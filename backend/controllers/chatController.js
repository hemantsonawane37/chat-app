const User = require("../models/userModule");
const Chat = require("../models/chatModel");
const CatchAsyncError = require("../ErrorHandlers/asyncHandler");
const Errorrspone = require("../ErrorHandlers/Errorresponse");
const asyncHandler = require("../ErrorHandlers/asyncHandler");

exports.accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId)
    return next(new Errorrspone("UserId Params not sent with request"));

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users"
    );
    res.status(200).json(FullChat);
  }
});

exports.fetchChats = asyncHandler(async (req, res, next) => {
  let results = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users")
    .populate("groupAdmin")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  results = await User.populate(results, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  res.status(200).json(results);
});

exports.CreateGroupChat = asyncHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users")
    .populate("groupAdmin");

  res.status(200).json(fullGroupChat);
});

exports.renameGroup = asyncHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users")
    .populate("groupAdmin");

  if (!updatedChat) {
    next(new Errorrspone("Chat Not Found", 404));
  } else {
    res.status(201).json(updatedChat);
  }
});

exports.removeFromGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users")
    .populate("groupAdmin");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

exports.addToGroup = asyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users")
    .populate("groupAdmin");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});
