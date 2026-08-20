<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Expense List</h1>
        <p class="text-gray-500 mt-1">Manage and track your utility bills and records</p>
      </div>
      <router-link
        to="/expenses/create"
        class="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-colors"
      >
        + Add Expense
      </router-link>
    </div>

    <!-- Filters Section -->
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Filter: Year -->
      <div class="flex flex-col space-y-1">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Year</label>
        <select
          v-model="filters.year"
          @change="fetchExpenses(1)"
          class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Years</option>
          <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <!-- Filter: Month -->
      <div class="flex flex-col space-y-1">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Month</label>
        <select
          v-model="filters.month"
          @change="fetchExpenses(1)"
          class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Months</option>
          <option v-for="(m, index) in monthNames" :key="index + 1" :value="index + 1">{{ m }}</option>
        </select>
      </div>

      <!-- Filter: Category -->
      <div class="flex flex-col space-y-1">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</label>
        <select
          v-model="filters.expense_category_id"
          @change="fetchExpenses(1)"
          class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <!-- Filter: Budget -->
      <div class="flex flex-col space-y-1">
        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider">Budget Type</label>
        <select
          v-model="filters.budget_category_id"
          @change="fetchExpenses(1)"
          class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All Budget Types</option>
          <option v-for="bgt in budgetCategories" :key="bgt.id" :value="bgt.id">{{ bgt.name }}</option>
        </select>
      </div>
    </div>

    <!-- Expenses Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
          <thead class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 text-left">Billing Month</th>
              <th class="px-6 py-4 text-left">Category</th>
              <th class="px-6 py-4 text-left">Budget Type</th>
              <th class="px-6 py-4 text-left">Invoice No</th>
              <th class="px-6 py-4 text-left">Paid Date</th>
              <th class="px-6 py-4 text-right">Amount</th>
              <th class="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
            <tr v-for="exp in expenses" :key="exp.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">
                {{ formatBillingMonth(exp.billing_month) }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                  {{ exp.expenseCategory?.name || '-' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                  {{ exp.budgetCategory?.name || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-gray-500">
                {{ exp.invoice_no || '-' }}
              </td>
              <td class="px-6 py-4 text-gray-500">
                {{ formatDate(exp.paid_date) }}
              </td>
              <td class="px-6 py-4 text-right font-extrabold text-gray-900">
                {{ formatCurrency(exp.amount) }}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                  <router-link
                    :to="`/expenses/${exp.id}/edit`"
                    class="bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
                  >
                    Edit
                  </router-link>
                  <button
                    @click="deleteExpense(exp.id)"
                    class="bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="expenses.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-400 font-medium">
                No expense records found matching the filters
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-gray-50/50 border-t border-gray-100 px-6 py-4 flex items-center justify-between">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Page {{ currentPage }} of {{ totalPages }} (Total: {{ totalCount }})
        </span>
        <div class="flex items-center space-x-1">
          <button
            :disabled="currentPage === 1"
            @click="fetchExpenses(currentPage - 1)"
            class="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 text-xs font-bold text-gray-600 transition-colors"
          >
            Prev
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="fetchExpenses(page)"
            :class="['px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors', currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 hover:bg-white text-gray-600']"
          >
            {{ page }}
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="fetchExpenses(currentPage + 1)"
            class="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 text-xs font-bold text-gray-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import api from '../services/api'

const expenses = ref([])
const categories = ref([])
const budgetCategories = ref([])

const currentPage = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const limit = 10

const filters = reactive({
  year: '',
  month: '',
  expense_category_id: '',
  budget_category_id: ''
})

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const formatBillingMonth = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH')
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val)
}

const fetchExpenses = async (page = 1) => {
  currentPage.value = page
  try {
    let query = `?page=${page}&limit=${limit}`
    if (filters.year) query += `&year=${filters.year}`
    if (filters.month) query += `&month=${filters.month}`
    if (filters.expense_category_id) query += `&expense_category_id=${filters.expense_category_id}`
    if (filters.budget_category_id) query += `&budget_category_id=${filters.budget_category_id}`

    const res = await api.get(`/expenses${query}`)
    if (res.data?.status === 'success') {
      expenses.value = res.data.data
      totalCount.value = res.data.total
      totalPages.value = Math.ceil(res.data.total / limit)
    }
  } catch (error) {
    console.error('Error fetching expenses:', error)
  }
}

const deleteExpense = async (id) => {
  if (!confirm('Are you sure you want to delete this expense record?')) return
  try {
    const res = await api.delete(`/expenses/${id}`)
    if (res.data?.status === 'success') {
      fetchExpenses(currentPage.value)
    }
  } catch (error) {
    console.error('Error deleting expense:', error)
  }
}

const fetchFilters = async () => {
  try {
    const [catRes, bgtRes] = await Promise.all([
      api.get('/expense-categories'),
      api.get('/budget-categories')
    ])
    if (catRes.data?.status === 'success') {
      categories.value = catRes.data.data
    }
    if (bgtRes.data?.status === 'success') {
      budgetCategories.value = bgtRes.data.data
    }
  } catch (error) {
    console.error('Error fetching filters data:', error)
  }
}

onMounted(() => {
  fetchFilters()
  fetchExpenses()
})
</script>
