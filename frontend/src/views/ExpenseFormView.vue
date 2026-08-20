<template>
  <div class="p-8 max-w-3xl mx-auto space-y-6">
    <div class="flex items-center space-x-4">
      <router-link
        to="/expenses"
        class="text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 text-sm bg-gray-100 px-3 py-1.5 rounded-lg"
      >
        <span>&larr; Back to List</span>
      </router-link>
      <h1 class="text-3xl font-extrabold text-gray-900">{{ isEditMode ? 'Edit Expense Record' : 'Add Utility Expense' }}</h1>
    </div>

    <div class="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Category -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Expense Category *</label>
            <select
              v-model="form.expense_category_id"
              required
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }} ({{ cat.unit }})</option>
            </select>
          </div>

          <!-- Budget Type -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Budget Type *</label>
            <select
              v-model="form.budget_category_id"
              required
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select Budget Type</option>
              <option v-for="bgt in budgetCategories" :key="bgt.id" :value="bgt.id">{{ bgt.name }}</option>
            </select>
          </div>

          <!-- Amount -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Amount (THB) *</label>
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <!-- Invoice Number -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Invoice Number</label>
            <input
              v-model="form.invoice_no"
              type="text"
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. INV-2026-001"
            />
          </div>

          <!-- Billing Month -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Billing Month *</label>
            <input
              v-model="form.billing_month"
              type="month"
              required
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Paid Date -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Paid Date</label>
            <input
              v-model="form.paid_date"
              type="date"
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Attachment Link -->
        <div class="flex flex-col space-y-1">
          <label class="text-sm font-bold text-gray-700">Attachment Link / Path</label>
          <input
            v-model="form.attachment_path"
            type="text"
            class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. http://example.com/receipt.pdf"
          />
        </div>

        <!-- Note -->
        <div class="flex flex-col space-y-1">
          <label class="text-sm font-bold text-gray-700">Notes / Description</label>
          <textarea
            v-model="form.note"
            rows="3"
            class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter notes here..."
          ></textarea>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
          {{ error }}
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
          <router-link
            to="/expenses"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            :disabled="loading"
            class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-8 py-3 rounded-xl shadow transition-colors"
          >
            {{ loading ? 'Saving...' : 'Save Record' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()

const categories = ref([])
const budgetCategories = ref([])
const loading = ref(false)
const error = ref('')

const isEditMode = computed(() => !!route.params.id)

const form = reactive({
  expense_category_id: '',
  budget_category_id: '',
  amount: '',
  billing_month: new Date().toISOString().slice(0, 7),
  paid_date: '',
  invoice_no: '',
  note: '',
  attachment_path: ''
})

const fetchCategories = async () => {
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
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

const fetchExpenseDetails = async () => {
  if (!isEditMode.value) return
  try {
    const res = await api.get(`/expenses/${route.params.id}`)
    if (res.data?.status === 'success') {
      const exp = res.data.data
      form.expense_category_id = exp.expense_category_id
      form.budget_category_id = exp.budget_category_id
      form.amount = parseFloat(exp.amount)
      form.invoice_no = exp.invoice_no || ''
      form.note = exp.note || ''
      form.attachment_path = exp.attachment_path || ''

      if (exp.billing_month) {
        form.billing_month = new Date(exp.billing_month).toISOString().slice(0, 7)
      }
      if (exp.paid_date) {
        form.paid_date = new Date(exp.paid_date).toISOString().slice(0, 10)
      } else {
        form.paid_date = ''
      }
    }
  } catch (err) {
    console.error('Error fetching expense details:', err)
    error.value = 'Failed to load expense record'
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  try {
    const billingMonthDate = new Date(`${form.billing_month}-01T00:00:00Z`)
    const payload = {
      ...form,
      billing_month: billingMonthDate.toISOString(),
      paid_date: form.paid_date ? new Date(form.paid_date).toISOString() : null
    }

    if (isEditMode.value) {
      await api.put(`/expenses/${route.params.id}`, payload)
    } else {
      await api.post('/expenses', payload)
    }
    router.push('/expenses')
  } catch (err) {
    console.error('Error saving expense:', err)
    error.value = err.response?.data?.message || 'Failed to save expense record'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchExpenseDetails()
})
</script>
