// Custom Imports
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const cloudinary = require("../cloudinary");

exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, email, pic, fileName } = req.body;

  // 1) Check if user exists
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("No user found", 404));
  }

  // 2) Image upload to Cloudinary
  const result = await cloudinary.uploader.upload(pic, {
    folder: "chat-app",
    public_id: fileName,
  });

  // 3) Update user
  const newUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      pic: result.secure_url,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  newUser.password = undefined;

  // 4) Send Response
  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const query = req.query.search;
  const currentUserId = req.user._id.toString();

  // User search based on name or email
  let filter = {};

  if (query) {
    filter = {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    };
  }

  let users = await User.find(filter);

  // Remove current user from response
  users = users.filter((user) => user._id.toString() !== currentUserId);

  // Remove password from response
  users.forEach((user) => {
    user.password = undefined;
  });

  res.status(200).json({
    status: "success",
    results: users.length,
    users,
  });
});
