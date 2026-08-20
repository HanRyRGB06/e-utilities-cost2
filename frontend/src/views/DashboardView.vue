<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
      <div>
        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p class="text-gray-500 mt-1">Overview of your utility costs and consumption metrics</p>
      </div>
      <div class="flex items-center space-x-2">
        <label class="text-sm font-semibold text-gray-600">Select Year:</label>
        <select
          v-model="selectedYear"
          @change="fetchDashboardData"
          class="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700 font-medium"
        >
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1: Total Cost -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Year Cost</h3>
        <p class="text-3xl font-extrabold text-gray-900 mt-2">{{ formatCurrency(totalCost) }}</p>
        <span class="text-xs text-gray-500 mt-1 block">Accumulated in {{ selectedYear }}</span>
      </div>

      <!-- Card 2: This Month -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">This Month</h3>
        <p class="text-3xl font-extrabold text-blue-600 mt-2">{{ formatCurrency(thisMonthCost) }}</p>
        <span class="text-xs text-gray-500 mt-1 block">Billing month {{ currentMonthName }}</span>
      </div>

      <!-- Card 3: Last Month -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">Last Month</h3>
        <p class="text-3xl font-extrabold text-gray-700 mt-2">{{ formatCurrency(lastMonthCost) }}</p>
        <span class="text-xs text-gray-500 mt-1 block">Billing month {{ lastMonthName }}</span>
      </div>

      <!-- Card 4: Change -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 class="text-gray-400 text-xs font-bold uppercase tracking-wider">MoM Change</h3>
        <div class="flex items-center mt-2">
          <span :class="['text-3xl font-extrabold', percentChange >= 0 ? 'text-red-500' : 'text-green-500']">
            {{ percentChange >= 0 ? '+' : '' }}{{ percentChange.toFixed(1) }}%
          </span>
          <span class="ml-2 text-sm text-gray-500">vs last month</span>
        </div>
        <span class="text-xs text-gray-500 mt-1 block">Based on monthly comparisons</span>
      </div>
    </div>

    <!-- Interactive Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Monthly Cost Bar Chart (2 columns wide) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Monthly Utility Expenses</h3>
          <span class="text-xs text-gray-400 font-semibold">Interactive Chart</span>
        </div>
        <div class="relative h-72">
          <canvas ref="monthlyChartCanvas"></canvas>
        </div>
      </div>

      <!-- Category Share Doughnut Chart (1 column wide) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Cost Share by Category</h3>
          <span class="text-xs text-gray-400 font-semibold">% Breakdown</span>
        </div>
        <div class="relative h-72 flex items-center justify-center">
          <canvas ref="categoryChartCanvas"></canvas>
        </div>
      </div>
    </div>

    <!-- Budget Breakdown & Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Budget Category Card -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 class="text-lg font-bold text-gray-900 mb-6">Costs by Budget Type</h3>
        <div class="space-y-4">
          <div v-for="bgt in budgetData" :key="bgt.code" class="space-y-1">
            <div class="flex justify-between text-sm font-medium">
              <span class="text-gray-700">{{ bgt.name }}</span>
              <span class="text-gray-900 font-bold">{{ formatCurrency(bgt.total) }} ({{ getPercentOfTotal(bgt.total) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" :style="{ width: getPercentOfTotal(bgt.total) + '%' }"></div>
            </div>
          </div>
          <div v-if="budgetData.length === 0" class="text-gray-400 text-center py-8">
            No budget category data available
          </div>
        </div>
      </div>

      <!-- Quick Info / Help card -->
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-md text-white flex flex-col justify-between">
        <div>
          <span class="bg-blue-500/30 text-blue-200 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Quick Advice</span>
          <h3 class="text-2xl font-bold mt-4 leading-snug">Efficiently track and budget for utility costs</h3>
          <p class="text-blue-100 text-sm mt-2 opacity-90">
            Categorizing your monthly utility bills under correct budget types allows you to generate detailed comparisons in the **Reports** section.
          </p>
        </div>
        <div class="mt-6 flex justify-between items-center">
          <router-link
            to="/expenses/create"
            class="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow"
          >
            + Add New Cost
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import api from '../services/api'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const selectedYear = ref(new Date().getFullYear())
const availableYears = ref([2024, 2025, 2026, 2027])

const totalCost = ref(0)
const monthlyData = ref([])
const categoriesData = ref([])
const budgetData = ref([])

const monthlyChartCanvas = ref(null)
const categoryChartCanvas = ref(null)

let monthlyChartInstance = null
let categoryChartInstance = null

const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthNamesFull = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const currentMonthIndex = new Date().getMonth()

const currentMonthName = computed(() => monthNamesFull[currentMonthIndex])
const lastMonthName = computed(() => monthNamesFull[currentMonthIndex === 0 ? 11 : currentMonthIndex - 1])

const thisMonthCost = computed(() => {
  const targetMonth = currentMonthIndex + 1
  const match = monthlyData.value.find(m => parseInt(m.month, 10) === targetMonth)
  return match ? parseFloat(match.total) : 0
})

const lastMonthCost = computed(() => {
  const prevMonth = currentMonthIndex === 0 ? 12 : currentMonthIndex
  const match = monthlyData.value.find(m => parseInt(m.month, 10) === prevMonth)
  return match ? parseFloat(match.total) : 0
})

const percentChange = computed(() => {
  const current = thisMonthCost.value
  const prev = lastMonthCost.value
  if (prev === 0) return current > 0 ? 100 : 0
  return ((current - prev) / prev) * 100
})

const getPercentOfTotal = (value) => {
  if (totalCost.value === 0) return 0
  return Math.round((parseFloat(value) / totalCost.value) * 100)
}

const formatCurrency = (val) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val)
}

const renderCharts = () => {
  // 1. Monthly Bar Chart
  if (monthlyChartCanvas.value) {
    if (monthlyChartInstance) {
      monthlyChartInstance.destroy()
    }

    const monthlyValuesArray = monthNamesShort.map((label, i) => {
      const targetMonth = i + 1
      const match = monthlyData.value.find(m => parseInt(m.month, 10) === targetMonth)
      return match ? parseFloat(match.total) : 0
    })

    const ctx = monthlyChartCanvas.value.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 300)
    gradient.addColorStop(0, '#2563EB')
    gradient.addColorStop(1, '#60A5FA')

    monthlyChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthNamesShort,
        datasets: [{
          label: 'Monthly Expense (THB)',
          data: monthlyValuesArray,
          backgroundColor: gradient,
          borderRadius: 8,
          borderSkipped: false,
          hoverBackgroundColor: '#1D4ED8'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Total: ${formatCurrency(context.raw)}`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            grid: { color: '#F3F4F6' },
            ticks: {
              callback: (val) => `฿${val}`
            }
          }
        }
      }
    })
  }

  // 2. Category Doughnut Chart
  if (categoryChartCanvas.value) {
    if (categoryChartInstance) {
      categoryChartInstance.destroy()
    }

    const labels = categoriesData.value.map(c => c.name)
    const dataValues = categoriesData.value.map(c => parseFloat(c.total))
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1']

    const ctx = categoryChartCanvas.value.getContext('2d')
    categoryChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.length > 0 ? labels : ['No Data'],
        datasets: [{
          data: dataValues.length > 0 ? dataValues : [1],
          backgroundColor: dataValues.length > 0 ? colors.slice(0, labels.length) : ['#E5E7EB'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, padding: 16 }
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${formatCurrency(context.raw)}`
            }
          }
        },
        cutout: '70%'
      }
    })
  }
}

const fetchDashboardData = async () => {
  try {
    const [summaryRes, categoryRes, budgetRes] = await Promise.all([
      api.get(`/dashboard/summary?year=${selectedYear.value}`),
      api.get(`/dashboard/by-category?year=${selectedYear.value}`),
      api.get(`/dashboard/by-budget?year=${selectedYear.value}`)
    ])

    if (summaryRes.data?.status === 'success') {
      totalCost.value = parseFloat(summaryRes.data.data.total)
      monthlyData.value = summaryRes.data.data.monthly
    }

    if (categoryRes.data?.status === 'success') {
      categoriesData.value = categoryRes.data.data
    }

    if (budgetRes.data?.status === 'success') {
      budgetData.value = budgetRes.data.data
    }

    await nextTick()
    renderCharts()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>
