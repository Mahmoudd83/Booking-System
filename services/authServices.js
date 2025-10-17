const asyncHandler = require("express-async-handler");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usersModel");
const createToken = require("../utils/createToken");

exports.SignUp = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role === "admin") {
    return next(new Error("you can't choice this role"));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  const token = createToken(user._id);

  res.status(201).json({ user, token });
});

exports.LogIn = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new Error("Incorrect Email or Password"));
  }

  const token = createToken(user._id);
  res.status(200).json({ user, token });
});

exports.Protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new Error("YOu Are Not Login, Please Login again"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new Error("this user no longer exist"));
  }

  req.user = currentUser;

  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("you are not authorized to access this route"));
    }
    next();
  });

exports.GoogleCallback = asyncHandler(async (req, res, next) => {
  const code = req.query.code;

  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:4000/api/auth/google/callback",
      grant_type: "authorization_code",
    });

    const accessToken = data.access_token;

    const { data: userInfo } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    let user = await User.findOne({ googleId: userInfo.id });
    if (!user) {
      user = await User.findOne({ email: userInfo.email });
      if (user) {
        user.googleId = userInfo.id;
        await user.save();
      } else {
        user = await User.create({
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
        });
      }
    }

    const token = createToken(user._id);

    res.json({ token, user });
  } catch (err) {
    console.error(
      "Google login error:",
      err.response?.data || err.message || err
    );
    res.status(500).json({
      message: "Error during Google login",
      error: err.response?.data || err.message,
    });
  }
});
