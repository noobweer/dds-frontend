<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import InputNumber from '@/volt/InputNumber.vue'
import InputText from '@/volt/InputText.vue'
import Dialog from '@/volt/Dialog.vue'
import { SquarePen } from 'lucide-vue-next'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import apiClient from '@/services/authService'

const toast = useToast()
const transactionsStore = useTransactionsStore()
const visible = ref(false)
const props = defineProps({
  transactionId: Number,
})

const statuses = computed(() => transactionsStore.getStatuses)
const types = computed(() => transactionsStore.getTypes)

const categories = ref([])
const subcategories = ref([])

const selectedStatus = ref([])
const selectedType = ref([])
const selectedCategory = ref([])
const selectedSubcategory = ref([])
const amount = ref(0)
const comment = ref('')

const openEditDialog = () => {
  const data = transactionsStore.getTransactionsById(props.transactionId)
  if (!data) {
    selectedStatus.value = []
    selectedType.value = []
    selectedCategory.value = []
    selectedSubcategory.value = []
    amount.value = 0
    comment.value = ''
    categories.value = []
    subcategories.value = []
    visible.value = true
    return
  }

  selectedStatus.value = data.status ? [data.status] : []
  selectedType.value = data.type ? [data.type] : []

  if (data.type?.name) {
    categories.value = transactionsStore.getCategoriesByType(data.type.name) || []
    selectedCategory.value = data.category ? [data.category] : []
  } else {
    categories.value = []
    selectedCategory.value = []
  }

  if (data.category?.name) {
    subcategories.value = transactionsStore.getSubcategoriesByCategory(data.category.name) || []
    selectedSubcategory.value = data.subcategory ? [data.subcategory] : []
  } else {
    subcategories.value = []
    selectedSubcategory.value = []
  }

  amount.value = data.amount || 0
  comment.value = data.comment || ''

  visible.value = true
}

watch(
  () => selectedType.value,
  (newVal) => {
    selectedCategory.value = []
    subcategories.value = []
    selectedSubcategory.value = []

    if (newVal && newVal.length > 0 && newVal[0]?.name) {
      categories.value = transactionsStore.getCategoriesByType(newVal[0].name) || []
    } else {
      categories.value = []
    }
  },
  { deep: true },
)

watch(
  () => selectedCategory.value,
  (newVal) => {
    selectedSubcategory.value = []

    if (newVal && newVal.length > 0 && newVal[0]?.name) {
      subcategories.value = transactionsStore.getSubcategoriesByCategory(newVal[0].name) || []
    } else {
      subcategories.value = []
    }
  },
  { deep: true },
)

const editTransaction = async () => {
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
    const response = await apiClient.post('edit-transaction/', {
      transaction_id: props.transactionId,
      status: selectedStatus.value[0].name,
      operation_type: selectedType.value[0].name,
      category: selectedCategory.value[0].name,
      subcategory: selectedSubcategory.value[0].name,
      amount: amount.value,
      comment: comment.value,
    })

    if (response.data.is_edited) {
      toast.add({
        severity: 'success',
        summary: 'Транзакция успешно изменена',
        detail: 'Операция выполнена успешно',
        life: 3000,
      })
      transactionsStore.fetchTransactions()
      visible.value = false
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Ошибка при изменение транзакции',
      detail: 'Поля неверно заполнены',
      life: 3000,
    })
  }
}
</script>

<template>
  <Button @click="openEditDialog" variant="text" size="small">
    <SquarePen />
  </Button>

  <Dialog v-model:visible="visible" modal header="Изменить транзакцию" class="sm:w-100 w-9/10">
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
        placeholder="Выберите подкатегорию"
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
      <Button type="button" label="Подтвердить" @click="editTransaction" />
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
