<script setup>
import Toast from '@/volt/Toast.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionsStore } from './stores/transactionsStore'
import { refreshAuthToken } from './services/authRefresh'
const router = useRouter()
const transactionsStore = useTransactionsStore()
const isLoading = ref(true)

onMounted(async () => {
  try {
    // Проверка токена
    if (!localStorage.getItem('access_token')) {
      console.log('Access token not found. Redirecting to login.')
      router.push('/login')
      return
    }

    // Загрузка данных
    await transactionsStore.fetchTransactions()
    await transactionsStore.fetchStatuses()
    await transactionsStore.fetchTypes()
    await transactionsStore.fetchCategories()
    await transactionsStore.fetchSubcategories()
    isLoading.value = false
  } catch (error) {
    console.error('Ошибка при инициализации данных:', error)

    // Попытка обновить токен
    const isTokenRefreshed = await refreshAuthToken()
    if (isTokenRefreshed) {
      await transactionsStore.fetchTransactions()
      isLoading.value = false
    } else {
      router.push('/login')
    }
  }
})
</script>

<template>
  <Toast />
  <router-view></router-view>
</template>

<style scoped></style>
