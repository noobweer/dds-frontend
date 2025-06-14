<script setup>
import Button from '@/volt/Button.vue'
import DataTable from '@/volt/DataTable.vue'
import Column from 'primevue/column'
import CreateTransaction from '@/components/CreateTransaction.vue'
import EditTransaction from '@/components/EditTransaction.vue'
import DeleteTransaction from '@/components/DeleteTransaction.vue'
import router from '@/router'
import { computed } from 'vue'
import { useTransactionsStore } from '@/stores/transactionsStore'

import { DoorOpen } from 'lucide-vue-next'

const pushLogin = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  router.push({ name: 'LoginPage' })
}

const transactionsStore = useTransactionsStore()

const transactions = computed(() => transactionsStore.getTransactions)
console.log(transactions)
</script>

<template>
  <div class="transactions">
    <DataTable :value="transactions" pt:table="min-w-200">
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="controls">
            <CreateTransaction />
          </div>
          <Button variant="text" @click="pushLogin" size="small">
            <span>Выйти</span> <DoorOpen />
          </Button>
        </div>
      </template>
      <Column field="status.name" header="Статус"></Column>
      <Column field="type.name" header="Тип"></Column>
      <Column field="category.name" header="Категория"></Column>
      <Column field="subcategory.name" header="Подкатегория"></Column>
      <Column field="amount" header="Стоимость">
        <template #body="slotProps">
          <span>{{ slotProps.data.amount }} ₽</span>
        </template>
      </Column>
      <Column field="comment" header="Комментарий"></Column>
      <Column field="created_date" header="Дата"></Column>
      <Column field="id" header="Управление">
        <template #body="slotProps">
          <span>{{ slotProps.data.id }}</span>
          <div class="controls"><EditTransaction /> <DeleteTransaction /></div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>
