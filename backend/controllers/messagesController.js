const Message = require("../models/messageModule");
const AsyncHandler = require("../ErrorHandlers/asyncHandler");
const ErrorResponse = require("../ErrorHandlers/Errorresponse");
const User = require("../models/userModule");
const Chat = require("../models/chatModel");

exports.PostMessage = AsyncHandler(async (req, res, next) => {
  const { chatId, content } = req.body;

  if (!chatId && !content) {
    next(new ErrorResponse("Please sent some content and chatId"));
    return;
  }

  const createdmessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  let message = await Message.create(createdmessage);
  message = await message.populate("sender", "name pic");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

  res.status(200).json(message);
});

exports.GetAllMessages = AsyncHandler(async (req, res, next) => {
  const { chatId } = req.query;

  if (!chatId) {
    next(new ErrorResponse("please sent params (chatId)"));
    return;
  }

  const message = await Message.find({ chat: chatId })
    .populate("sender", "name pic")
    .populate("chat");

  res.status(200).json(message);
});
