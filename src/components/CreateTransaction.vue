<script setup>
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import Dialog from '@/volt/Dialog.vue'
import { useTransactionsStore } from '@/stores/transactionsStore'
import { ref, computed, watch } from 'vue'
import { CirclePlus } from 'lucide-vue-next'

const transactionsStore = useTransactionsStore()

const visible = ref(false)

const statuses = computed(() => transactionsStore.getStatuses)
const selectedStatus = ref(null)

const types = computed(() => transactionsStore.getTypes)
const selectedType = ref(null)

const categories = ref()
watch(
  () => selectedType.value,
  (newType) => {
    if (newType) {
      const result = transactionsStore.getCategoriesByType(newType[0].name)
      categories.value = result
    } else {
      categories.value = []
    }
  },
  { immediate: true },
)
const selectedCategory = ref(null)

const subcategories = ref()
watch(
  () => selectedCategory.value,
  (newCategory) => {
    if (newCategory) {
      const result = transactionsStore.getSubcategoriesByCategory(newCategory[0].name)
      subcategories.value = result
    } else {
      subcategories.value = []
    }
  },
  { immediate: true },
)
const selectedSubcategory = ref(null)
</script>

<template>
  <Button variant="text" @click="visible = true" size="small">
    <span>Создать тразакцию</span> <CirclePlus />
  </Button>

  <Dialog v-model:visible="visible" modal header="Создать транзакцию" class="sm:w-100 w-9/10">
    <div class="flex gap-2">
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
    </div>

    <div class="flex gap-2">
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
    </div>

    <div class="flex gap-2">
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
    </div>

    <div class="flex gap-2">
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
    </div>

    <div class="flex justify-end gap-2">
      <SecondaryButton type="button" label="Отмена" @click="visible = false" />
      <Button type="button" label="Подтвердить" @click="visible = false" />
    </div>
  </Dialog>
</template>

<style scoped></style>
