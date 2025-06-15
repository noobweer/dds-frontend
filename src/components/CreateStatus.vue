<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import InputText from '@/volt/InputText.vue'
import Dialog from '@/volt/Dialog.vue'
import apiClient from '@/services/authService'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { CirclePlus } from 'lucide-vue-next'

const transactionsStore = useTransactionsStore()
const toast = useToast()

const visible = ref(false)
const statusName = ref('')

const createTransaction = async () => {
  if (!statusName.value) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка при создании статуса',
      detail: 'Заполните все поля',
      life: 3000,
    })
    return
  }

  try {
    const response = await apiClient.post('create-status/', {
      name: statusName.value,
    })

    if (response.data.is_created) {
      toast.add({
        severity: 'success',
        summary: 'Статус успешно создана',
        detail: 'Операция выполнена успешно',
        life: 3000,
      })
      transactionsStore.fetchStatuses()
      visible.value = false
    }
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Ошибка при создании статуса',
      detail: 'Поля неверно заполнены',
      life: 3000,
    })
  }
}
</script>

<template>
  <Button variant="text" @click="visible = true" size="small">
    <span>Добавить статус</span> <CirclePlus />
  </Button>

  <Dialog v-model:visible="visible" modal header="Создать статус" class="sm:w-100 w-9/10">
    <div class="inputs">
      <InputText v-model="statusName" placeholder="Введите название" class="w-full" />
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
