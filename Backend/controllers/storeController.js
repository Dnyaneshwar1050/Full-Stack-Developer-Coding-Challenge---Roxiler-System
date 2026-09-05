const storeService = require('../services/storeService');

exports.listStores = async (req, res, next) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const stores = await storeService.listStores(req.query, currentUserId);
    return res.json(stores);
  } catch (err) {
    next(err);
  }
};

exports.getStoreDetails = async (req, res, next) => {
  try {
    const store = await storeService.getStoreDetails(req.params.id);
    return res.json(store);
  } catch (err) {
    next(err);
  }
};

exports.submitOrUpdateRating = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;
    const result = await storeService.submitOrUpdateRating(
      req.user.id,
      storeId,
      req.body.rating
    );
    return res.json(result);
  } catch (err) {
    next(err);
  }
};
