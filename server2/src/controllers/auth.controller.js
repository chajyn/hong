const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService } = require('../services');

const getUserInfo = catchAsync(async (req, res) => {
  const jwtUserId = req.user._id.toString();
  const { userId } = req.body;
  if (jwtUserId !== userId) {
    const response = { msg: `You cannot access others profile management page` };
    res.status(httpStatus.FORBIDDEN).send(response);
  }
  const user = await userService.getUserById(userId);
  const response = { user: user.transform() };
  res.send(response);
});

const updateUserInfo = catchAsync(async (req, res) => {
  const jwtUserId = req.user._id.toString();
  const { userId } = req.body;
  if (jwtUserId !== userId) {
    const response = { msg: `You cannot access others profile management page` };
    res.status(httpStatus.FORBIDDEN).send(response);
  }
  const user = await userService.updateUserInfo(req.body);
  const response = { user: user.transform() };
  res.send(response);
});

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await authService.generateAuthTokens(user.id);
  const response = { user: user.transform(), tokens };
  res.status(httpStatus.CREATED).send(response);
});

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body.email, req.body.password);
  const tokens = await authService.generateAuthTokens(user.id);
  const response = { user: user.transform(), tokens };
  res.send(response);
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthTokens(req.body.refreshToken);
  const response = { ...tokens };
  res.send(response);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await authService.generateResetPasswordToken(req.body.email);
  const response = { resetPasswordToken };
  res.send(response);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  getUserInfo,
  updateUserInfo,
  register,
  login,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
