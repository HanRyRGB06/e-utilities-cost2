<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">{{ title }}</h1>
        <p class="text-gray-500 mt-1">Create, update, and manage categories for utility bills</p>
      </div>
      <button
        @click="openModalForAdd"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow transition-colors"
      >
        + Add Category
      </button>
    </div>

    <!-- Categories List Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full min-w-max">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <tr>
            <th class="px-6 py-4 text-left">Name</th>
            <th class="px-6 py-4 text-left">Code</th>
            <th v-if="isExpenseCategory" class="px-6 py-4 text-left">Unit</th>
            <th class="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
          <tr v-for="cat in categories" :key="cat.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 font-semibold text-gray-900">{{ cat.name }}</td>
            <td class="px-6 py-4 font-mono text-gray-500">{{ cat.code }}</td>
            <td v-if="isExpenseCategory" class="px-6 py-4 text-gray-500">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded bg-gray-100 text-xs font-semibold text-gray-800">
                {{ cat.unit }}
              </span>
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center space-x-2">
                <button
                  @click="openModalForEdit(cat)"
                  class="bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-600 font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
                >
                  Edit
                </button>
                <button
                  @click="deleteCategory(cat.id)"
                  class="bg-gray-100 hover:bg-red-100 hover:text-red-700 text-gray-600 font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="categories.length === 0">
            <td :colspan="isExpenseCategory ? 4 : 3" class="px-6 py-12 text-center text-gray-400 font-medium">
              No categories configured yet. Click "+ Add Category" to create one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Form overlay -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6">
        <h3 class="text-2xl font-bold text-gray-900">{{ editId ? 'Edit Category' : 'Add New Category' }}</h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Category Name *</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Electricity"
            />
          </div>

          <!-- Code -->
          <div class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Code *</label>
            <input
              v-model="form.code"
              type="text"
              required
              :disabled="!!editId"
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="e.g. ELEC"
            />
          </div>

          <!-- Unit (Only for Expense Category) -->
          <div v-if="isExpenseCategory" class="flex flex-col space-y-1">
            <label class="text-sm font-bold text-gray-700">Measurement Unit *</label>
            <input
              v-model="form.unit"
              type="text"
              required
              class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. kWh, m³, บาท"
            />
          </div>

          <div v-if="modalError" class="text-red-600 text-xs font-semibold">
            {{ modalError }}
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-6 py-2.5 rounded-xl shadow transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()

const categories = ref([])
const showModal = ref(false)
const editId = ref(null)
const modalError = ref('')
const loading = ref(false)

const form = reactive({
  name: '',
  code: '',
  unit: ''
})

const isExpenseCategory = computed(() => route.path.includes('expense-categories'))
const title = computed(() => isExpenseCategory.value ? 'Expense Categories' : 'Budget Categories')
const apiEndpoint = computed(() => isExpenseCategory.value ? '/expense-categories' : '/budget-categories')

const fetchCategories = async () => {
  try {
    const res = await api.get(apiEndpoint.value)
    if (res.data?.status === 'success') {
      categories.value = res.data.data
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

watch(apiEndpoint, () => {
  fetchCategories()
})

const openModalForAdd = () => {
  editId.value = null
  form.name = ''
  form.code = ''
  form.unit = isExpenseCategory.value ? 'บาท' : ''
  modalError.value = ''
  showModal.value = true
}

const openModalForEdit = (cat) => {
  editId.value = cat.id
  form.name = cat.name
  form.code = cat.code
  form.unit = cat.unit || ''
  modalError.value = ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const handleSubmit = async () => {
  loading.value = true
  modalError.value = ''
  try {
    const payload = {
      name: form.name,
      code: form.code,
      unit: isExpenseCategory.value ? form.unit : undefined
    }

    if (editId.value) {
      await api.put(`${apiEndpoint.value}/${editId.value}`, payload)
    } else {
      await api.post(apiEndpoint.value, payload)
    }
    showModal.value = false
    fetchCategories()
  } catch (err) {
    console.error('Error saving category:', err)
    modalError.value = err.response?.data?.message || 'Failed to save category'
  } finally {
    loading.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) return
  try {
    const res = await api.delete(`${apiEndpoint.value}/${id}`)
    if (res.data?.status === 'success') {
      fetchCategories()
    }
  } catch (err) {
    console.error('Error deleting category:', err)
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
