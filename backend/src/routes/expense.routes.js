const express = require('express');
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, expenseController.getAll);
router.get('/:id', authMiddleware, expenseController.getById);
router.post('/', authMiddleware, expenseController.create);
router.put('/:id', authMiddleware, expenseController.update);
router.delete('/:id', authMiddleware, expenseController.delete);

module.exports = router;
