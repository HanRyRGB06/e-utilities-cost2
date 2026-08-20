const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/summary', authMiddleware, dashboardController.summary);
router.get('/by-category', authMiddleware, dashboardController.byCategory);
router.get('/by-budget', authMiddleware, dashboardController.byBudget);
router.get('/compare', authMiddleware, dashboardController.compare);

module.exports = router;
