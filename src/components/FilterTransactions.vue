<script setup>
import DatePicker from '@/volt/DatePicker.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import Button from '@/volt/Button.vue'
import { ref, computed } from 'vue'
import { ListFilter, ListRestart } from 'lucide-vue-next'
import { useTransactionsStore } from '@/stores/transactionsStore'
const transactionsStore = useTransactionsStore()

const selectedDates = ref([])
const selectedStatuses = ref([])
const selectedTypes = ref([])
const selectedCategories = ref([])
const selectedSubcategories = ref([])

const statuses = computed(() => transactionsStore.getStatuses)
const types = computed(() => transactionsStore.getTypes)
const categories = computed(() => transactionsStore.getCategories)
const subcategories = computed(() => transactionsStore.getSubcategories)

const applyFilters = async () => {
  const filters = {}

  // Даты
  if (selectedDates.value.length > 0 && selectedDates.value[0]) {
    filters.date = selectedDates.value.map((date) => {
      return new Date(date).toISOString().split('T')[0] // Преобразование в формат YYYY-MM-DD
    })
  }

  // Статусы
  if (selectedStatuses.value.length > 0) {
    filters.status = selectedStatuses.value.map((item) => item.name)
  }

  // Типы операций
  if (selectedTypes.value.length > 0) {
    filters.type = selectedTypes.value.map((item) => item.name)
  }

  // Категории
  if (selectedCategories.value.length > 0) {
    filters.category = selectedCategories.value.map((item) => item.name)
  }

  // Подкатегории
  if (selectedSubcategories.value.length > 0) {
    filters.subcategory = selectedSubcategories.value.map((item) => item.name)
  }

  // Передача фильтров в хранилище
  Object.keys(filters).forEach((key) => {
    transactionsStore.setFilter(key, filters[key])
  })

  // Запрос к серверу
  await transactionsStore.applyFilters()
}

const removeFilters = async () => {
  selectedDates.value = []
  selectedStatuses.value = []
  selectedTypes.value = []
  selectedCategories.value = []
  selectedSubcategories.value = []

  Object.keys(transactionsStore.filters).forEach((key) => {
    transactionsStore.setFilter(key, [])
  })

  await transactionsStore.applyFilters()
}
</script>

<template>
  <div class="filter-transactions">
    <Button size="small" @click="applyFilters"><ListFilter /></Button>
    <Button size="small" @click="removeFilters"><ListRestart /></Button>
    <DatePicker
      v-model="selectedDates"
      selectionMode="range"
      placeholder="Выберите дату или период"
      :manualInput="false"
      dateFormat="yy-mm-dd"
      size="small"
      class="w-[13rem]"
    />

    <MultiSelect
      v-model="selectedStatuses"
      :options="statuses"
      optionLabel="name"
      filter
      placeholder="Выберите статус"
      :maxSelectedLabels="3"
      size="small"
    />

    <MultiSelect
      v-model="selectedTypes"
      :options="types"
      optionLabel="name"
      filter
      placeholder="Выберите тип операции"
      :maxSelectedLabels="3"
      size="small"
    />

    <MultiSelect
      v-model="selectedCategories"
      :options="categories"
      optionLabel="name"
      filter
      placeholder="Выберите категорию"
      :maxSelectedLabels="3"
      size="small"
    />

    <MultiSelect
      v-model="selectedSubcategories"
      :options="subcategories"
      optionLabel="name"
      filter
      placeholder="Выберите подкатегорию"
      :maxSelectedLabels="3"
      size="small"
    />
  </div>
</template>

<style scoped>
.filter-transactions {
  display: flex;
  gap: 1rem;
}
</style>
