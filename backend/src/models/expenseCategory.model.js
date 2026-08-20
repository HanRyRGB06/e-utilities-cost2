const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExpenseCategory = sequelize.define('ExpenseCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'บาท',
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
  tableName: 'expense_categories',
  timestamps: false,
});

module.exports = ExpenseCategory;
