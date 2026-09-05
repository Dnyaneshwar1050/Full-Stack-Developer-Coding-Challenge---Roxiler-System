const { Sequelize } = require('sequelize');
require('dotenv').config();

const isRemote =
  process.env.DB_HOST &&
  process.env.DB_HOST !== '127.0.0.1' &&
  process.env.DB_HOST !== 'localhost';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    dialectOptions: isRemote
      ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
      : {},
    logging: false,
  }
);

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    await sequelize.sync({
      force: false, // Set to true only in development to recreate tables
      alter: process.env.NODE_ENV === 'development'
    });
    console.log('✅ Database synchronized successfully.');

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };