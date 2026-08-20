const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const BudgetCategory = sequelize.define('BudgetCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'budget_categories',
  timestamps: false,
});

module.exports = BudgetCategory;
