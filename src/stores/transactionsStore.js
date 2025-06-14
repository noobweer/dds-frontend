import { defineStore } from 'pinia'
import apiClient from '@/services/authService'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    statuses: [],
    types: [],
    categories: [],
    subcategories: [],
  }),

  getters: {
    getTransactions(state) {
      return state.transactions
    },
    getTransactionsById: (state) => {
      return (id) => {
        return state.transactions.find((transaction) => transaction.id === Number(id)) || null
      }
    },
    getStatuses(state) {
      return state.statuses
    },
    getTypes(state) {
      return state.types
    },
    getCategories(state) {
      return state.categories
    },
    getCategoriesByType(state) {
      return (typeName) => {
        if (!typeName) return []
        return state.categories.filter(
          (category) => category.type?.name?.toLowerCase() === String(typeName).toLowerCase(),
        )
      }
    },
    getSubcategories(state) {
      return state.subcategories
    },
    getSubcategoriesByCategory(state) {
      return (categoryName) => {
        if (!categoryName) return []
        return state.subcategories.filter(
          (subcategory) =>
            subcategory.category?.name?.toLowerCase() === String(categoryName).toLowerCase(),
        )
      }
    },
  },

  actions: {
    async fetchTransactions(filters = {}) {
      try {
        const response = await apiClient.post('transactions/', filters)

        if (response.data && Array.isArray(response.data.transactions)) {
          this.transactions = response.data.transactions
        } else {
          console.error('Ответ от сервера имеет некорректную структуру')
          throw new Error('Некорректный формат данных')
        }
      } catch (error) {
        console.error('Ошибка при получении transactions:', error)
        throw error
      }
    },

    async fetchStatuses() {
      try {
        const response = await apiClient.get('statuses/')

        if (response.data.success) {
          this.statuses = response.data.statuses
        } else {
          console.error('Ответ от сервера имеет некорректную структуру')
          throw new Error('Некорректный формат данных')
        }
      } catch (error) {
        console.error('Ошибка при получении statuses:', error)
        throw error
      }
    },

    async fetchTypes() {
      try {
        const response = await apiClient.get('types/')

        if (response.data.success) {
          this.types = response.data.types
        } else {
          console.error('Ответ от сервера имеет некорректную структуру')
          throw new Error('Некорректный формат данных')
        }
      } catch (error) {
        console.error('Ошибка при получении types:', error)
        throw error
      }
    },

    async fetchCategories() {
      try {
        const response = await apiClient.get('categories/')

        if (response.data.success) {
          this.categories = response.data.categories
        } else {
          console.error('Ответ от сервера имеет некорректную структуру')
          throw new Error('Некорректный формат данных')
        }
      } catch (error) {
        console.error('Ошибка при получении categories:', error)
        throw error
      }
    },

    async fetchSubcategories() {
      try {
        const response = await apiClient.get('subcategories/')

        if (response.data.success) {
          this.subcategories = response.data.subcategories
        } else {
          console.error('Ответ от сервера имеет некорректную структуру')
          throw new Error('Некорректный формат данных')
        }
      } catch (error) {
        console.error('Ошибка при получении subcategories:', error)
        throw error
      }
    },

    setFilter(key, value) {
      if (['date', 'status', 'type', 'category', 'subcategory'].includes(key)) {
        this.filters[key] = value
      }
    },

    async applyFilters() {
      await this.fetchAds(this.filters)
    },
  },
})
