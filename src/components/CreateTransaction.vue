<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import InputNumber from '@/volt/InputNumber.vue'
import InputText from '@/volt/InputText.vue'
import Dialog from '@/volt/Dialog.vue'
import apiClient from '@/services/authService'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import { CirclePlus } from 'lucide-vue-next'

const transactionsStore = useTransactionsStore()
const toast = useToast()

const visible = ref(false)

const statuses = computed(() => transactionsStore.getStatuses)
const types = computed(() => transactionsStore.getTypes)

const categories = ref([])
const subcategories = ref([])

const selectedStatus = ref([])
const selectedType = ref([])
const selectedCategory = ref([])
const selectedSubcategory = ref([])
const amount = ref(10)
const comment = ref('')

// Сбросить все поля
const resetFields = () => {
  amount.value = 10
  comment.value = ''
  selectedCategory.value = []
  selectedSubcategory.value = []
  selectedStatus.value = []
  selectedType.value = []
  categories.value = []
  subcategories.value = []
}

// Watch для категорий при смене типа
watch(
  () => selectedType.value,
  (newType) => {
    if (newType && newType.length > 0 && newType[0]?.name) {
      categories.value = transactionsStore.getCategoriesByType(newType[0].name) || []
    } else {
      categories.value = []
    }
    // Сбросить выбранную категорию и подкатегорию при смене типа
    selectedCategory.value = []
    selectedSubcategory.value = []
    subcategories.value = []
  },
)

// Watch для подкатегорий при смене категории
watch(
  () => selectedCategory.value,
  (newCategory) => {
    if (newCategory && newCategory.length > 0 && newCategory[0]?.name) {
      subcategories.value = transactionsStore.getSubcategoriesByCategory(newCategory[0].name) || []
    } else {
      subcategories.value = []
    }
    // Сбросить выбранную подкатегорию при смене категории
    selectedSubcategory.value = []
  },
)

// Сбросить поля при открытии диалога
watch(
  () => visible.value,
  (val) => {
    if (val) {
      resetFields()
    }
  },
)

const createTransaction = async () => {
  if (
    !amount.value ||
    !selectedCategory.value.length ||
    !selectedSubcategory.value.length ||
    !selectedStatus.value.length ||
    !selectedType.value.length
  ) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка при создании',
      detail: 'Заполните все поля',
      life: 3000,
    })
    return
  }

  try {
    const response = await apiClient.post('create-transaction/', {
      status: selectedStatus.value[0].name,
      operation_type: selectedType.value[0].name,
      category: selectedCategory.value[0].name,
      subcategory: selectedSubcategory.value[0].name,
      amount: amount.value,
      comment: comment.value,
    })

    if (response.data.is_created) {
      toast.add({
        severity: 'success',
        summary: 'Транзакция успешно создана',
        detail: 'Операция выполнена успешно',
        life: 3000,
      })
      transactionsStore.fetchTransactions()
      visible.value = false
      resetFields()
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Ошибка при создании транзакции',
      detail: 'Поля неверно заполнены',
      life: 3000,
    })
  }
}
</script>

<template>
  <Button variant="text" @click="visible = true" size="small">
    <span>Создать тразакцию</span> <CirclePlus />
  </Button>

  <Dialog v-model:visible="visible" modal header="Создать транзакцию" class="sm:w-100 w-9/10">
    <div class="inputs">
      <MultiSelect
        v-model="selectedStatus"
        :options="statuses"
        optionLabel="name"
        filter
        placeholder="Выберите статус"
        :maxSelectedLabels="1"
        :selectionLimit="1"
        class="w-full"
      />

      <MultiSelect
        v-model="selectedType"
        :options="types"
        optionLabel="name"
        filter
        placeholder="Выберите тип операции"
        :maxSelectedLabels="1"
        :selectionLimit="1"
        class="w-full"
      />

      <MultiSelect
        v-model="selectedCategory"
        :options="categories"
        optionLabel="name"
        filter
        placeholder="Выберите категорию"
        :maxSelectedLabels="1"
        :selectionLimit="1"
        class="w-full"
      />

      <MultiSelect
        v-model="selectedSubcategory"
        :options="subcategories"
        optionLabel="name"
        filter
        placeholder="Выберите категорию"
        :maxSelectedLabels="1"
        :selectionLimit="1"
        class="w-full"
      />

      <InputNumber
        v-model="amount"
        inputId="currency-russia"
        mode="currency"
        currency="RUB"
        locale="ru-RU"
        fluid
      />

      <InputText v-model="comment" placeholder="Введите комментарий" class="w-full" />
    </div>

    <div class="flex justify-end gap-2">
      <SecondaryButton type="button" label="Отмена" @click="visible = false" />
      <Button type="button" label="Подтвердить" @click="createTransaction" />
    </div>
  </Dialog>
</template>

<style scoped>
.inputs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
