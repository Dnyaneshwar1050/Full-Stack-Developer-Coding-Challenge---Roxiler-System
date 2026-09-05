const adminService = require('../services/adminService');

exports.dashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return res.json(stats);
  } catch (err) {
    next(err);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await adminService.listUsers(req.query);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.listStores = async (req, res, next) => {
  try {
    const stores = await adminService.listStores(req.query);
    return res.json(stores);
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

exports.createStore = async (req, res, next) => {
  try {
    const store = await adminService.createStore(req.body);
    return res.status(201).json(store);
  } catch (err) {
    next(err);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await adminService.getUserDetails(req.params.id);
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const result = await adminService.deleteUser(req.params.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const result = await adminService.deleteStore(req.params.id);
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
