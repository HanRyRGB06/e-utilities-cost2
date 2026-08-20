require('dotenv').config();
const sequelize = require('../src/config/db');
const Expense = require('../src/models/expense.model');
const ExpenseCategory = require('../src/models/expenseCategory.model');
const BudgetCategory = require('../src/models/budgetCategory.model');
const User = require('../src/models/user.model');

const seedSampleData = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.log('✗ Admin user not found.');
      process.exit(1);
    }

    const categories = await ExpenseCategory.findAll();
    const budgetCategories = await BudgetCategory.findAll();

    if (categories.length === 0 || budgetCategories.length === 0) {
      console.log('✗ Categories not found.');
      process.exit(1);
    }

    const elecCat = categories.find(c => c.code === 'ELEC') || categories[0];
    const waterCat = categories.find(c => c.code === 'WATER') || categories[1] || categories[0];
    const gasCat = categories.find(c => c.code === 'GAS') || categories[2] || categories[0];

    const monthlyBudget = budgetCategories.find(b => b.code === 'MONTHLY') || budgetCategories[0];
    const yearlyBudget = budgetCategories.find(b => b.code === 'YEARLY') || budgetCategories[0];

    const existingCount = await Expense.count();
    if (existingCount > 0) {
      console.log(`✓ Database already has ${existingCount} expense records.`);
      process.exit(0);
    }

    const sampleRecords = [];

    // Generate records for 2025 (Months 1-12)
    for (let m = 1; m <= 12; m++) {
      const monthStr = String(m).padStart(2, '0');
      // Electricity
      sampleRecords.push({
        expense_category_id: elecCat.id,
        budget_category_id: monthlyBudget.id,
        amount: Math.floor(2500 + Math.random() * 800),
        billing_month: new Date(`2025-${monthStr}-01T00:00:00Z`),
        paid_date: new Date(`2025-${monthStr}-15T00:00:00Z`),
        invoice_no: `INV-2025-ELEC-${monthStr}`,
        note: `Electricity bill for ${monthStr}/2025`,
        created_by: admin.id
      });
      // Water
      sampleRecords.push({
        expense_category_id: waterCat.id,
        budget_category_id: monthlyBudget.id,
        amount: Math.floor(450 + Math.random() * 150),
        billing_month: new Date(`2025-${monthStr}-01T00:00:00Z`),
        paid_date: new Date(`2025-${monthStr}-16T00:00:00Z`),
        invoice_no: `INV-2025-WTR-${monthStr}`,
        note: `Water bill for ${monthStr}/2025`,
        created_by: admin.id
      });
    }

    // Generate records for 2026 (Months 1-8)
    for (let m = 1; m <= 8; m++) {
      const monthStr = String(m).padStart(2, '0');
      // Electricity
      sampleRecords.push({
        expense_category_id: elecCat.id,
        budget_category_id: monthlyBudget.id,
        amount: Math.floor(2900 + Math.random() * 900),
        billing_month: new Date(`2026-${monthStr}-01T00:00:00Z`),
        paid_date: new Date(`2026-${monthStr}-12T00:00:00Z`),
        invoice_no: `INV-2026-ELEC-${monthStr}`,
        note: `Electricity bill for ${monthStr}/2026`,
        created_by: admin.id
      });
      // Water
      sampleRecords.push({
        expense_category_id: waterCat.id,
        budget_category_id: monthlyBudget.id,
        amount: Math.floor(520 + Math.random() * 180),
        billing_month: new Date(`2026-${monthStr}-01T00:00:00Z`),
        paid_date: new Date(`2026-${monthStr}-14T00:00:00Z`),
        invoice_no: `INV-2026-WTR-${monthStr}`,
        note: `Water bill for ${monthStr}/2026`,
        created_by: admin.id
      });
      // Gas
      sampleRecords.push({
        expense_category_id: gasCat.id,
        budget_category_id: yearlyBudget.id,
        amount: Math.floor(1200 + Math.random() * 300),
        billing_month: new Date(`2026-${monthStr}-01T00:00:00Z`),
        paid_date: new Date(`2026-${monthStr}-18T00:00:00Z`),
        invoice_no: `INV-2026-GAS-${monthStr}`,
        note: `Gas bill for ${monthStr}/2026`,
        created_by: admin.id
      });
    }

    await Expense.bulkCreate(sampleRecords);
    console.log(`✅ Successfully seeded ${sampleRecords.length} sample utility expense records!`);
    await sequelize.close();
  } catch (err) {
    console.error('✗ Seeding error:', err);
    process.exit(1);
  }
};

seedSampleData();
