<template>
  <aside class="w-64 bg-gray-800 text-white min-h-screen p-4">
    <nav class="space-y-2">
      <router-link
        to="/"
        class="block px-4 py-2 rounded hover:bg-gray-700"
      >
        📊 Dashboard
      </router-link>
      <router-link
        to="/expenses"
        class="block px-4 py-2 rounded hover:bg-gray-700"
      >
        💰 Expenses
      </router-link>
      <router-link
        to="/settings/expense-categories"
        class="block px-4 py-2 rounded hover:bg-gray-700"
      >
        🏷️ Expense Categories
      </router-link>
      <router-link
        to="/settings/budget-categories"
        class="block px-4 py-2 rounded hover:bg-gray-700"
      >
        📑 Budget Categories
      </router-link>
      <router-link
        to="/reports"
        class="block px-4 py-2 rounded hover:bg-gray-700"
      >
        📈 Reports
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
</script>
