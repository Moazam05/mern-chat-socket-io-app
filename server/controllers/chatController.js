const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

exports.createChat = catchAsync(async (req, res, next) => {
  // 1) Check if userId is provided || receiverId is provided
  const { userId } = req.body;

  if (!userId) {
    return next(new AppError("Please provide a user id for chat", 400));
  }

  // 2) Check if chat already exists
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [{ users: { $in: [req.user._id] } }, { users: { $in: [userId] } }],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  if (isChat.length > 0) {
    // return chat
    return res.status(200).json({
      status: "success",
      chat: isChat[0],
    });
  } else {
    // Create new chat
    const newChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    });

    const FullChat = await Chat.findById(newChat._id).populate(
      "users",
      "-password"
    );

    return res.status(200).json({
      status: "success",
      chat: FullChat,
    });
  }
});

exports.getChat = catchAsync(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const FullChat = await User.populate(chat, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  res.status(200).json({
    status: "success",
    chat: FullChat,
  });
});
