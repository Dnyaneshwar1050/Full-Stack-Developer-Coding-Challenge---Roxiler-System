const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully.' })
};

exports.updatePassword = async (req, res, next) => {
  try {
    const result = await authService.updatePassword(req.user.id, req.body.newPassword);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
