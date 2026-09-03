// Store information model

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Store = sequelize.define('Store', {
    name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(400),
        allowNull: false,
    },
},  {
    tableName: 'stores',
    timestamps: true,
});

module.exports = Store;