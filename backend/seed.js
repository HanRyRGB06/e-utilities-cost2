require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./src/config/db');
const User = require('./src/models/user.model');
const ExpenseCategory = require('./src/models/expenseCategory.model');
const BudgetCategory = require('./src/models/budgetCategory.model');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // Sync all models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✓ Models synchronized');

    // Create default admin user
    const existingUser = await User.findOne({ where: { username: 'admin' } });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        full_name: 'Administrator',
        role: 'admin'
      });
      console.log('✓ Default admin user created (admin/admin123)');
    } else {
      console.log('✓ Admin user already exists');
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
    console.log('✓ Default expense categories created');

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
    console.log('✓ Default budget categories created');

    console.log('\n✅ Database seeding completed successfully!');
    await sequelize.close();
  } catch (error) {
    console.error('✗ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
