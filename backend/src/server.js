require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
const bcrypt = require('bcrypt');

const PORT = process.env.PORT || 3000;

const User = require('./models/user.model');
const ExpenseCategory = require('./models/expenseCategory.model');
const BudgetCategory = require('./models/budgetCategory.model');
const Expense = require('./models/expense.model');

// Setup relationships
User.hasMany(Expense, { foreignKey: 'created_by' });
Expense.belongsTo(User, { foreignKey: 'created_by' });

ExpenseCategory.hasMany(Expense, { foreignKey: 'expense_category_id' });
Expense.belongsTo(ExpenseCategory, { foreignKey: 'expense_category_id', as: 'expenseCategory' });

BudgetCategory.hasMany(Expense, { foreignKey: 'budget_category_id' });
Expense.belongsTo(BudgetCategory, { foreignKey: 'budget_category_id', as: 'budgetCategory' });

// Seed default data
const seedDatabase = async () => {
  try {
    // Create default admin user
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        full_name: 'Administrator',
        role: 'admin'
      });
      console.log('✓ Default admin user created (admin/admin123)');
    }

    // Create default expense categories
    const defaultExpenseCategories = [
      { name: 'ไฟฟ้า', code: 'ELEC', unit: 'kWh', is_active: true },
      { name: 'น้ำประปา', code: 'WATER', unit: 'ม³', is_active: true },
      { name: 'ก๊าซ', code: 'GAS', unit: 'ลบ.ม.', is_active: true },
      { name: 'ทำความสะอาด', code: 'CLEAN', unit: 'บาท', is_active: true },
      { name: 'อื่นๆ', code: 'OTHER', unit: 'บาท', is_active: true }
    ];

    for (const cat of defaultExpenseCategories) {
      const exists = await ExpenseCategory.findOne({ where: { code: cat.code } });
      if (!exists) {
        await ExpenseCategory.create(cat);
      }
    }

    // Create default budget categories
    const defaultBudgetCategories = [
      { name: 'ประมาณการรายเดือน', code: 'MONTHLY', is_active: true },
      { name: 'ประมาณการรายปี', code: 'YEARLY', is_active: true },
      { name: 'ฉุกเฉิน', code: 'EMERGENCY', is_active: true }
    ];

    for (const cat of defaultBudgetCategories) {
      const exists = await BudgetCategory.findOne({ where: { code: cat.code } });
      if (!exists) {
        await BudgetCategory.create(cat);
      }
    }
  } catch (error) {
    console.error('✗ Seeding error:', error);
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Models synchronized');

    // Seed default data
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
