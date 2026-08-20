const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const expenseCategoryRoutes = require('./routes/expenseCategory.routes');
const budgetCategoryRoutes = require('./routes/budgetCategory.routes');
const expenseRoutes = require('./routes/expense.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/budget-categories', budgetCategoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use(errorMiddleware);

module.exports = app;
