const { Op } = require('sequelize');
const { User, Store, Rating } = require('../models');

// 1. Dashboard summary stats
const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.count(),
    Store.count(),
    Rating.count(),
  ]);

  return { totalUsers, totalStores, totalRatings };
};

// 2. List users with search and sort
const listUsers = async ({ name, email, address, role, sortBy = 'name', order = 'asc' }) => {
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };
  if (role) where.role = role;

  const users = await User.findAll({
    where,
    order: [[sortBy, order.toUpperCase()]],
    attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
  });

  return users;
};

// 3. List stores with average rating
const listStores = async ({ name, email, address, sortBy = 'name', order = 'asc' }) => {
  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (address) where.address = { [Op.iLike]: `%${address}%` };

  const stores = await Store.findAll({
    where,
    order: [[sortBy, order.toUpperCase()]],
    include: [{ model: Rating, attributes: ['rating'] }],
  });

  return stores.map((store) => {
    const ratings = store.Ratings || store.ratings || [];
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length ? (total / ratings.length).toFixed(2) : 0;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating,
      createdAt: store.createdAt,
    };
  });
};

// 4. Create user
const createUser = async ({ name, email, password, address, role = 'normal' }) => {
  const exists = await User.findOne({ where: { email } });
  if (exists) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({ name, email, password, address, role });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
  };
};

// 5. Create store
const createStore = async ({ name, email, address, ownerId }) => {
  const store = await Store.create({
    name,
    email,
    address,
    ownerId: ownerId || null,
  });
  return store;
};

// 6. User details with owned store rating
const getUserDetails = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Store,
        as: 'store',
        include: [{ model: Rating, attributes: ['rating'] }],
      },
    ],
    attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt'],
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const response = {
    id: user.id,
    name: user.name,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
  };

  if (user.store) {
    const ratings = user.store.Ratings || user.store.ratings || [];
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    response.storeRating = ratings.length ? (total / ratings.length).toFixed(2) : null;
  }

  return response;
};

module.exports = {
  getDashboardStats,
  listUsers,
  listStores,
  createUser,
  createStore,
  getUserDetails,
};
