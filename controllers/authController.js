const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    maxAge: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    http: true,
  };
  //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt-try", token, cookieOptions);

  user.password = undefined;
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.register = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm, name } = req.body;
    console.log("we are here", email, password, passwordConfirm, name);
    const newUser = await User.create({
      email,
      password,
      passwordConfirm,
      name,
    });
    res.status(201).json({
      status: "success",
      data: {
        newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "Fail",
        message: "Please provide email and password!",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "Fail",
        message: "Incorrect email or password!",
      });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};
