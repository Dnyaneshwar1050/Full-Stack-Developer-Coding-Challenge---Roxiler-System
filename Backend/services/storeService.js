const { Op } = require('sequelize');
const { Store, Rating } = require('../models');

// List stores with search, sort, average rating, and requesting user's rating
const listStores = async (query = {}, currentUserId = null) => {
  const { name, address, sortBy = 'name', order = 'asc' } = query;
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  const stores = await Store.findAll({
    where,
    order: [[sortBy, order.toUpperCase()]],
    include: [{ model: Rating, attributes: ['rating', 'userId'] }],
  });

  return stores.map((store) => {
    const ratings = store.Ratings || store.ratings || [];
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length ? (total / ratings.length).toFixed(2) : 0;

    const myRatingRecord = currentUserId
      ? ratings.find((r) => r.userId === currentUserId)
      : null;

    return {
      id: store.id,
      name: store.name,
      address: store.address,
      averageRating,
      userRating: myRatingRecord ? myRatingRecord.rating : null,
    };
  });
};

// Get single store details
const getStoreDetails = async (storeId) => {
  const store = await Store.findByPk(storeId, {
    include: [{ model: Rating, attributes: ['rating'] }],
  });

  if (!store) {
    const err = new Error('Store not found');
    err.statusCode = 404;
    throw err;
  }

  const ratings = store.Ratings || store.ratings || [];
  const total = ratings.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = ratings.length ? (total / ratings.length).toFixed(2) : null;

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    overallRating: averageRating,
  };
};

// Submit new rating or update existing one (unique constraint on userId + storeId)
const submitOrUpdateRating = async (userId, storeId, rating) => {
  const store = await Store.findByPk(storeId);
  if (!store) {
    const err = new Error('Store not found');
    err.statusCode = 404;
    throw err;
  }

  let ratingRecord = await Rating.findOne({ where: { userId, storeId } });
  if (ratingRecord) {
    ratingRecord.rating = rating;
    await ratingRecord.save();
  } else {
    ratingRecord = await Rating.create({ userId, storeId, rating });
  }

  // Calculate updated average
  const allRatings = await Rating.findAll({
    where: { storeId },
    attributes: ['rating'],
  });
  const total = allRatings.reduce((sum, r) => sum + r.rating, 0);
  const average = allRatings.length ? (total / allRatings.length).toFixed(2) : null;

  return {
    rating: ratingRecord.rating,
    average,
  };
};

module.exports = {
  listStores,
  getStoreDetails,
  submitOrUpdateRating,
};
