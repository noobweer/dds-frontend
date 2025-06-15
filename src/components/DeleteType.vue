<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Dialog from '@/volt/Dialog.vue'
import apiClient from '@/services/authService'
import { useTransactionsStore } from '@/stores/transactionsStore'

import { Trash2 } from 'lucide-vue-next'

import { ref } from 'vue'
import { useToast } from 'primevue'

const transactionsStore = useTransactionsStore()
const toast = useToast()
const visible = ref(false)

const props = defineProps({
  typeId: Number,
})

const deleteType = async () => {
  try {
    const response = await apiClient.post('delete-type/', {
      id: props.typeId,
    })

    if (response.data.is_deleted) {
      toast.add({
        severity: 'success',
        summary: 'Тип операции успешно удален',
        detail: 'Операция выполнена успешно',
        life: 3000,
      })
      transactionsStore.fetchTypes()
      visible.value = false
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Невозможно удалить, так как есть записи с этим типом операции',
        detail: response.data.message,
        life: 3000,
      })
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Ошибка при удаление типа операции',
      detail: 'Больше деталей в консоле',
      life: 3000,
    })
  }
}
</script>

<template>
  <Button @click="visible = true" variant="text" size="small"><Trash2 /></Button>

  <Dialog v-model:visible="visible" modal header="Удалить тип операции" class="sm:w-100 w-9/10">
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Вы уверены, что хотите удалить этот тип операции?</span
    >
    <div class="flex justify-end gap-2">
      <SecondaryButton type="button" label="Отмена" @click="visible = false" />
      <Button type="button" label="Подтвердить" @click="deleteType" />
    </div>
  </Dialog>
</template>

<style scoped></style>
