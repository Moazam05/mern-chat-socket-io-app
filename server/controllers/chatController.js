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

exports.createGroupChat = catchAsync(async (req, res, next) => {
  const { chatName, users } = req.body;

  if (!chatName) {
    return next(new AppError("Please provide a chat name ", 400));
  }

  if (!users || users.length < 1) {
    return next(new AppError("Please provide at least 1 users ", 400));
  }

  const newUsers = [...users, req.user._id];

  // 1) Check if chat already exists with the same name and with the same groupAdmin
  const isChat = await Chat.find({
    isGroupChat: true,
    chatName,
    users: { $all: newUsers },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (isChat.length > 0) {
    return next(
      new AppError("You already have a group chat with the same name", 400)
    );
  }

  // 2) Chat Create
  const newChat = await Chat.create({
    chatName,
    isGroupChat: true,
    users: newUsers,
    groupAdmin: req.user._id,
  });

  // 3) Chat Find
  const FullChat = await Chat.findById(newChat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  // 4) Response
  res.status(200).json({
    status: "success",
    message: "Group chat created successfully",
    chat: FullChat,
  });
});

exports.renameGroupChat = catchAsync(async (req, res, next) => {
  const { chatName } = req.body;

  if (!chatName) {
    return next(new AppError("Please provide a chat name ", 400));
  }

  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new AppError("No chat found with that id", 404));
  }

  chat.chatName = chatName;
  await chat.save();

  res.status(200).json({
    status: "success",
    chat,
  });
});

exports.addToGroupChat = catchAsync(async (req, res, next) => {
  const { userId: users } = req.body;

  if (!users || users.length < 1) {
    return next(new AppError("Please provide at least 1 users ", 400));
  }

  const newUsers = [...users, req.user._id];

  // 1) Only Admin can add users to group chat
  const chat = await Chat.findById(req.params.id);
  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not the admin of this group", 400));
  }

  // 2) Update Chat with new users
  chat.users = newUsers;
  await chat.save();

  // 3) Send Response
  res.status(200).json({
    status: "success",
    message: "Group chat updated successfully",
    chat,
  });
});

exports.removeFromGroupChat = catchAsync(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return next(new AppError("Please provide a user id", 400));
  }

  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    return next(new AppError("No chat found with that id", 404));
  }

  if (chat.groupAdmin.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not the admin of this group", 400));
  }

  if (!chat.users.includes(userId)) {
    return next(new AppError("User not in this group", 400));
  }

  const index = chat.users.indexOf(userId);
  chat.users.splice(index, 1);
  await chat.save();

  const FullChat = await Chat.findById(chat._id)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.status(200).json({
    status: "success",
    chat: FullChat,
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  const chats = await Chat.find({
    users: { $in: [req.user._id] },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const FullChats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name email pic",
  });

  res.status(200).json({
    status: "success",
    chats: FullChats,
  });
});
