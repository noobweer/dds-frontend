<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import InputText from '@/volt/InputText.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import Dialog from '@/volt/Dialog.vue'
import apiClient from '@/services/authService'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { ref, computed } from 'vue'
import { useToast } from 'primevue/usetoast'
import { SquarePen } from 'lucide-vue-next'

const transactionsStore = useTransactionsStore()
const toast = useToast()

const props = defineProps({
  id: Number,
  name: String,
  type: Object,
})

const visible = ref(false)
const categoryName = ref(props.name)
const types = computed(() => transactionsStore.getTypes)
const selectedType = ref([props.type])

const createCategory = async () => {
  if (!categoryName.value || !selectedType.value[0].id || !props.id) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка при изменение категории',
      detail: 'Заполните все поля',
      life: 3000,
    })
    return
  }

  try {
    const response = await apiClient.post('edit-category/', {
      id: props.id,
      name: categoryName.value,
      type_id: selectedType.value[0].id,
    })

    if (response.data.is_edited) {
      toast.add({
        severity: 'success',
        summary: 'Категория успешно изменена',
        detail: 'Операция выполнена успешно',
        life: 3000,
      })
      transactionsStore.fetchCategories()
      visible.value = false
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Невозможно изменить категорию',
        detail: response.data.message,
        life: 3000,
      })
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Ошибка при изменение категории',
      detail: 'Поля неверно заполнены',
      life: 3000,
    })
  }
}
</script>

<template>
  <Button variant="text" @click="visible = true" size="small"><SquarePen /> </Button>

  <Dialog v-model:visible="visible" modal header="Изменить категорию" class="sm:w-100 w-9/10">
    <div class="inputs">
      <InputText v-model="categoryName" placeholder="Введите название" class="w-full" />

      <MultiSelect
        v-model="selectedType"
        :options="types"
        optionLabel="name"
        filter
        placeholder="Тип операции относящийся к категории"
        :maxSelectedLabels="1"
        :selectionLimit="1"
        class="w-full"
      />
    </div>

    <div class="flex justify-end gap-2">
      <SecondaryButton type="button" label="Отмена" @click="visible = false" />
      <Button type="button" label="Подтвердить" @click="createCategory" />
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
