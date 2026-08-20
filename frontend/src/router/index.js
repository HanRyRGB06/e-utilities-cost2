import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ExpenseListView from '../views/ExpenseListView.vue'
import ExpenseFormView from '../views/ExpenseFormView.vue'
import CategoryManageView from '../views/CategoryManageView.vue'
import ReportHistoryView from '../views/ReportHistoryView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses',
    name: 'ExpenseList',
    component: ExpenseListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/create',
    name: 'ExpenseCreate',
    component: ExpenseFormView,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/:id/edit',
    name: 'ExpenseEdit',
    component: ExpenseFormView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/expense-categories',
    name: 'ExpenseCategoryManage',
    component: CategoryManageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings/budget-categories',
    name: 'BudgetCategoryManage',
    component: CategoryManageView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'ReportHistory',
    component: ReportHistoryView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
