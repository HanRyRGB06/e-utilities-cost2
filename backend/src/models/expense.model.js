const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expense_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'expense_categories',
      key: 'id',
    },
  },
  budget_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'budget_categories',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  billing_month: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  paid_date: {
    type: DataTypes.DATE,
  },
  invoice_no: {
    type: DataTypes.STRING(50),
  },
  note: {
    type: DataTypes.TEXT,
  },
  attachment_path: {
    type: DataTypes.STRING(255),
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'expenses',
  timestamps: false,
});

module.exports = Expense;
