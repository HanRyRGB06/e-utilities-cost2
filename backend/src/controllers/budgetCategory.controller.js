const BudgetCategory = require('../models/budgetCategory.model');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await BudgetCategory.findAll({
      where: { is_active: true },
    });
    res.json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const category = await BudgetCategory.create({ name, code });

    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, is_active } = req.body;

    const category = await BudgetCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.update({ name, code, is_active });

    res.json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await BudgetCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();

    res.json({ status: 'success', message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
