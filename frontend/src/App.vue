<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <Navbar v-if="isAuthenticated" />
    <div class="flex">
      <Sidebar v-if="isAuthenticated" />
      <main class="flex-1">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Sidebar from './components/layout/Sidebar.vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}
</style>
