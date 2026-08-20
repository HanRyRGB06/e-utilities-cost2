const { Op } = require('sequelize');
const sequelize = require('../config/db');
const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const BudgetCategory = require('../models/budgetCategory.model');

exports.summary = async (req, res, next) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    const monthly = await sequelize.query(
      `SELECT DATE_FORMAT(billing_month, '%m') as month, SUM(amount) as total
       FROM expenses
       WHERE YEAR(billing_month) = ?
       GROUP BY MONTH(billing_month)
       ORDER BY MONTH(billing_month)`,
      {
        replacements: [currentYear],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const total = await Expense.sum('amount', {
      where: {
        billing_month: { [Op.between]: [startDate, endDate] },
      },
    });

    res.json({
      status: 'success',
      data: {
        year: currentYear,
        total: total || 0,
        monthly,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.byCategory = async (req, res, next) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    const byCategory = await sequelize.query(
      `SELECT ec.name, ec.code, SUM(e.amount) as total
       FROM expenses e
       JOIN expense_categories ec ON e.expense_category_id = ec.id
       WHERE YEAR(e.billing_month) = ?
       GROUP BY e.expense_category_id
       ORDER BY total DESC`,
      {
        replacements: [currentYear],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ status: 'success', data: byCategory });
  } catch (error) {
    next(error);
  }
};

exports.byBudget = async (req, res, next) => {
  try {
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();

    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    const byBudget = await sequelize.query(
      `SELECT bc.name, bc.code, SUM(e.amount) as total
       FROM expenses e
       JOIN budget_categories bc ON e.budget_category_id = bc.id
       WHERE YEAR(e.billing_month) = ?
       GROUP BY e.budget_category_id
       ORDER BY total DESC`,
      {
        replacements: [currentYear],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ status: 'success', data: byBudget });
  } catch (error) {
    next(error);
  }
};

exports.compare = async (req, res, next) => {
  try {
    const { year1, year2 } = req.query;

    if (!year1 || !year2) {
      return res.status(400).json({ message: 'year1 and year2 are required' });
    }

    const compare = await sequelize.query(
      `SELECT 
        DATE_FORMAT(billing_month, '%m') as month,
        YEAR(billing_month) as year,
        SUM(amount) as total
       FROM expenses
       WHERE YEAR(billing_month) IN (?, ?)
       GROUP BY YEAR(billing_month), MONTH(billing_month)
       ORDER BY YEAR(billing_month), MONTH(billing_month)`,
      {
        replacements: [year1, year2],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json({ status: 'success', data: compare });
  } catch (error) {
    next(error);
  }
};
