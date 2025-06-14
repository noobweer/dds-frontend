<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Dialog from '@/volt/Dialog.vue'

import { SquarePen } from 'lucide-vue-next'

import { ref } from 'vue'

const visible = ref(false)
</script>

<template>
  <Button @click="visible = true" size="small"><SquarePen /></Button>

  <Dialog v-model:visible="visible" modal header="Edit Profile" class="sm:w-100 w-9/10">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-24">Username</label>
      <InputText id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="email" class="font-semibold w-24">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <SecondaryButton type="button" label="Cancel" @click="visible = false" />
      <Button type="button" label="Save" @click="visible = false" />
    </div>
  </Dialog>
</template>

<style scoped></style>
