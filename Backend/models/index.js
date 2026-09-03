// Initializes and manages all models and their relationships.

const sequelize = require('../config/database');
const User = require('./user.model');
const Store = require('./store.model');
const Rating = require('./rating.model');

Store.belongsTo(User, {
    as: 'owner', 
    foreignKey: 'ownerId' 
});

User.hasOne(Store, { 
    as: 'store', 
    foreignKey: 'ownerId' 
});

User.hasMany(Rating, { 
    foreignKey: 'userId' 
});
Rating.belongsTo(User, { 
    foreignKey: 'userId' 
});

Store.hasMany(Rating, { 
    foreignKey: 'storeId' 
});
Rating.belongsTo(Store, { 
    foreignKey: 'storeId' 
});

module.exports = { sequelize, User, Store, Rating };