<template>
  <div class="p-8 max-w-7xl mx-auto space-y-6">
    <div>
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Reports & History</h1>
      <p class="text-gray-500 mt-1">Generate year-over-year cost comparison reports</p>
    </div>

    <!-- Period Selection Panel -->
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-4xl">
      <h2 class="text-lg font-bold text-gray-900 mb-4">Compare Utility Costs Between Years</h2>
      
      <form @submit.prevent="generateReport" class="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4">
        <!-- Year 1 -->
        <div class="flex-1 flex flex-col space-y-1 w-full">
          <label class="text-sm font-bold text-gray-700">Base Year (Year 1)</label>
          <select
            v-model.number="year1"
            required
            class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Year 2 -->
        <div class="flex-1 flex flex-col space-y-1 w-full">
          <label class="text-sm font-bold text-gray-700">Comparison Year (Year 2)</label>
          <select
            v-model.number="year2"
            required
            class="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option v-for="y in [2024, 2025, 2026, 2027]" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <!-- Compare Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-8 py-2.5 rounded-xl shadow transition-colors h-[42px] flex items-center justify-center"
        >
          {{ loading ? 'Analyzing...' : 'Compare' }}
        </button>
      </form>
      <div v-if="validationError" class="text-red-600 text-xs font-semibold mt-2">
        {{ validationError }}
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="reportGenerated" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total in {{ year1 }}</h3>
        <p class="text-2xl font-extrabold text-gray-900 mt-2">{{ formatCurrency(totalYear1) }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total in {{ year2 }}</h3>
        <p class="text-2xl font-extrabold text-gray-900 mt-2">{{ formatCurrency(totalYear2) }}</p>
      </div>
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Difference</h3>
        <p :class="['text-2xl font-extrabold mt-2', overallDiff >= 0 ? 'text-red-600' : 'text-green-600']">
          {{ overallDiff >= 0 ? '+' : '' }}{{ formatCurrency(overallDiff) }}
          <span class="text-sm font-semibold ml-1">({{ overallDiff >= 0 ? '+' : '' }}{{ overallVariance.toFixed(1) }}%)</span>
        </p>
      </div>
    </div>

    <!-- Comparison Table -->
    <div v-if="reportGenerated" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-lg font-bold text-gray-900">Month-by-Month Variance Analysis</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-max">
          <thead class="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 text-left">Month</th>
              <th class="px-6 py-4 text-right">{{ year1 }} Cost</th>
              <th class="px-6 py-4 text-right">{{ year2 }} Cost</th>
              <th class="px-6 py-4 text-right">Difference</th>
              <th class="px-6 py-4 text-center">Variance %</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
            <tr v-for="row in comparisonRows" :key="row.month" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-semibold text-gray-900">{{ row.monthName }}</td>
              <td class="px-6 py-4 text-right">{{ formatCurrency(row.val1) }}</td>
              <td class="px-6 py-4 text-right">{{ formatCurrency(row.val2) }}</td>
              <td :class="['px-6 py-4 text-right font-semibold', row.diff >= 0 ? 'text-red-500' : 'text-green-500']">
                {{ row.diff >= 0 ? '+' : '' }}{{ formatCurrency(row.diff) }}
              </td>
              <td class="px-6 py-4 text-center font-bold">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded text-xs', row.diff >= 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700']">
                  {{ row.diff >= 0 ? '+' : '' }}{{ row.variance.toFixed(1) }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../services/api'

const year1 = ref(new Date().getFullYear() - 1)
const year2 = ref(new Date().getFullYear())
const loading = ref(false)
const validationError = ref('')
const reportGenerated = ref(false)
const rawReportData = ref([])

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const formatCurrency = (val) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val)
}

const comparisonRows = computed(() => {
  if (rawReportData.value.length === 0) return []

  return monthNames.map((monthName, index) => {
    const targetMonth = index + 1
    const matchYear1 = rawReportData.value.find(item => parseInt(item.month, 10) === targetMonth && Number(item.year) === year1.value)
    const matchYear2 = rawReportData.value.find(item => parseInt(item.month, 10) === targetMonth && Number(item.year) === year2.value)

    const val1 = matchYear1 ? parseFloat(matchYear1.total) : 0
    const val2 = matchYear2 ? parseFloat(matchYear2.total) : 0
    const diff = val2 - val1
    const variance = val1 === 0 ? (val2 > 0 ? 100 : 0) : (diff / val1) * 100

    return {
      month: monthStr,
      monthName,
      val1,
      val2,
      diff,
      variance
    }
  })
})

const totalYear1 = computed(() => {
  return comparisonRows.value.reduce((sum, row) => sum + row.val1, 0)
})

const totalYear2 = computed(() => {
  return comparisonRows.value.reduce((sum, row) => sum + row.val2, 0)
})

const overallDiff = computed(() => {
  return totalYear2.value - totalYear1.value
})

const overallVariance = computed(() => {
  const y1 = totalYear1.value
  if (y1 === 0) return totalYear2.value > 0 ? 100 : 0
  return (overallDiff.value / y1) * 100
})

const generateReport = async () => {
  validationError.value = ''
  if (year1.value === year2.value) {
    validationError.value = 'Base Year and Comparison Year must be different'
    return
  }

  loading.value = true
  try {
    const res = await api.get(`/dashboard/compare?year1=${year1.value}&year2=${year2.value}`)
    if (res.data?.status === 'success') {
      rawReportData.value = res.data.data
      reportGenerated.value = true
    }
  } catch (err) {
    console.error('Error generating comparison report:', err)
    validationError.value = err.response?.data?.message || 'Failed to generate comparison report'
  } finally {
    loading.value = false
  }
}
</script>
