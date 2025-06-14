<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Dialog from '@/volt/Dialog.vue'

import { Trash2 } from 'lucide-vue-next'

import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <Button @click="visible = true" size="small"><Trash2 /></Button>

  <Dialog v-model:visible="visible" modal header="Удалить транзакцию" class="sm:w-100 w-9/10">
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Вы уверены, что хотите удалить транзакцию?</span
    >
    <div class="flex justify-end gap-2">
      <SecondaryButton type="button" label="Отмена" @click="visible = false" />
      <Button type="button" label="Подтвердить" @click="visible = false" />
    </div>
  </Dialog>
</template>

<style scoped></style>
