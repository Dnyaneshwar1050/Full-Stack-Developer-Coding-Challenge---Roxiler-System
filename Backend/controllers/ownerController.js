const ownerService = require('../services/ownerService');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await ownerService.getOwnerDashboard(req.user.id);
    return res.json(data);
  } catch (err) {
    next(err);
  }
};
