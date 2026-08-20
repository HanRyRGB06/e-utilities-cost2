const { Op } = require('sequelize');
const Expense = require('../models/expense.model');
const ExpenseCategory = require('../models/expenseCategory.model');
const BudgetCategory = require('../models/budgetCategory.model');

exports.getAll = async (req, res, next) => {
  try {
    const { month, year, expense_category_id, budget_category_id, page = 1, limit = 10 } = req.query;
    const where = {};

    if (month && year) {
      const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      where.billing_month = { [Op.between]: [startDate, endDate] };
    }

    if (expense_category_id) where.expense_category_id = expense_category_id;
    if (budget_category_id) where.budget_category_id = budget_category_id;

    const expenses = await Expense.findAndCountAll({
      where,
      include: [
        { model: ExpenseCategory, as: 'expenseCategory' },
        { model: BudgetCategory, as: 'budgetCategory' },
      ],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      order: [['billing_month', 'DESC']],
    });

    res.json({
      status: 'success',
      data: expenses.rows,
      total: expenses.count,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id, {
      include: [
        { model: ExpenseCategory, as: 'expenseCategory' },
        { model: BudgetCategory, as: 'budgetCategory' },
      ],
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ status: 'success', data: expense });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { expense_category_id, budget_category_id, amount, billing_month, paid_date, invoice_no, note, attachment_path } = req.body;

    if (!expense_category_id || !budget_category_id || !amount || !billing_month) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const expense = await Expense.create({
      expense_category_id,
      budget_category_id,
      amount,
      billing_month: new Date(billing_month),
      paid_date: paid_date ? new Date(paid_date) : null,
      invoice_no,
      note,
      attachment_path,
      created_by: req.user.id,
    });

    res.status(201).json({ status: 'success', data: expense });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { expense_category_id, budget_category_id, amount, billing_month, paid_date, invoice_no, note, attachment_path } = req.body;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.update({
      expense_category_id,
      budget_category_id,
      amount,
      billing_month: billing_month ? new Date(billing_month) : expense.billing_month,
      paid_date: paid_date ? new Date(paid_date) : expense.paid_date,
      invoice_no,
      note,
      attachment_path,
      updated_at: new Date(),
    });

    res.json({ status: 'success', data: expense });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.destroy();

    res.json({ status: 'success', message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};
