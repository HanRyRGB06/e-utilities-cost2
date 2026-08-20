<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-3xl font-bold mb-6 text-center text-blue-600">e-Utilities Cost</h1>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-bold mb-2">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label class="block text-gray-700 font-bold mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  console.log('handleLogin values:', username.value, password.value)
  loading.value = true
  error.value = ''
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>
