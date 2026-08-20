const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'e_utilities_cost',
  process.env.DB_USER || 'app_user',
  process.env.DB_PASSWORD || 'changeme',
  {
    host: process.env.DB_HOST || 'mariadb',
    port: process.env.DB_PORT || 3306,
    dialect: 'mariadb',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
    },
  }
);

module.exports = sequelize;
