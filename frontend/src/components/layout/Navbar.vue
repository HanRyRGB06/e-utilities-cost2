<template>
  <nav class="bg-blue-600 text-white p-4 shadow-lg">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold">e-Utilities Cost</h1>
      <div class="flex items-center space-x-6">
        <span>{{ authStore.user?.full_name }}</span>
        <button
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
