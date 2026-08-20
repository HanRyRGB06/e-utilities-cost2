const express = require('express');
const budgetCategoryController = require('../controllers/budgetCategory.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', budgetCategoryController.getAll);
router.post('/', authMiddleware, budgetCategoryController.create);
router.put('/:id', authMiddleware, budgetCategoryController.update);
router.delete('/:id', authMiddleware, budgetCategoryController.delete);

module.exports = router;
