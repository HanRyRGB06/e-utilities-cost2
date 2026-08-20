const express = require('express');
const expenseCategoryController = require('../controllers/expenseCategory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', expenseCategoryController.getAll);
router.post('/', authMiddleware, expenseCategoryController.create);
router.put('/:id', authMiddleware, expenseCategoryController.update);
router.delete('/:id', authMiddleware, expenseCategoryController.delete);

module.exports = router;
