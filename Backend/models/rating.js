// Store rating model

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
    },
},  {
    tableName: 'ratings',
    timestamps: true,
    indexes: [
        { 
            unique: true, 
            fields: ['userId', 'storeId'] 
        },
    ],
});

module.exports = Rating;