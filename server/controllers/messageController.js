const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new AppError("Please provide a message and chat id", 400));
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  const message = await Message.findById(newMessage._id)
    .populate("sender", "name pic")
    .populate("chat");

  // User Populate
  const FullMessage = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  // Populate the latestMessage
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { latestMessage: message._id },
    { new: true }
  ).populate("latestMessage");

  res.status(200).json({
    status: "success",
    message: FullMessage,
    chat,
  });
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const chatId = req.params.chatId;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name pic email")
    .populate("chat");

  res.status(200).json({
    status: "success",
    messages,
  });
});
