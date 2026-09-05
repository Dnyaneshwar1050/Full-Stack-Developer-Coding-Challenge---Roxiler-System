const { sequelize } = require('../config/database');
const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

// Store <-> User (Owner)
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasOne(Store, { as: 'store', foreignKey: 'ownerId' });

// User <-> Rating
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// Store <-> Rating
Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

module.exports = { sequelize, User, Store, Rating };