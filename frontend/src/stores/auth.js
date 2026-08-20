import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const isAuthenticated = computed(() => !!accessToken.value)

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password })
      accessToken.value = response.data.accessToken
      user.value = response.data.user
      localStorage.setItem('accessToken', accessToken.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      accessToken.value = null
      user.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }

  const setToken = (token) => {
    accessToken.value = token
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  const getToken = () => accessToken.value || localStorage.getItem('accessToken')

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
    setToken,
    getToken
  }
})
