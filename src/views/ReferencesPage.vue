<script setup>
import Tabs from '@/volt/Tabs.vue'
import TabList from '@/volt/TabList.vue'
import Tab from '@/volt/Tab.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'
import DataTable from '@/volt/DataTable.vue'
import Column from 'primevue/column'
import Button from '@/volt/Button.vue'
import router from '@/router'

import DeleteStatus from '@/components/DeleteStatus.vue'
import CreateStatus from '@/components/CreateStatus.vue'
import EditStatus from '@/components/EditStatus.vue'

import DeleteType from '@/components/DeleteType.vue'
import CreateType from '@/components/CreateType.vue'
import EditType from '@/components/EditType.vue'

import DeleteCategory from '@/components/DeleteCategory.vue'
import CreateCategory from '@/components/CreateCategory.vue'

import { useTransactionsStore } from '@/stores/transactionsStore'
import { ChartNoAxesColumn } from 'lucide-vue-next'
import { DoorOpen } from 'lucide-vue-next'
import { computed } from 'vue'

const transactionsStore = useTransactionsStore()

const statuses = computed(() => transactionsStore.getStatuses)
const types = computed(() => transactionsStore.getTypes)
const categories = computed(() => transactionsStore.getCategories)
const subcategories = computed(() => transactionsStore.getSubcategories)

const pushTransactions = () => {
  router.push({ name: 'TransactionsPage' })
}
</script>

<template>
  <div class="references">
    <Tabs :value="0">
      <TabList>
        <Tab :value="0" class="flex items-center gap-2">
          <ChartNoAxesColumn />
          <span>Статусы</span>
        </Tab>
        <Tab :value="1" class="flex items-center gap-2">
          <ChartNoAxesColumn />
          <span>Типы операций</span>
        </Tab>
        <Tab :value="2" class="flex items-center gap-2">
          <ChartNoAxesColumn />
          <span>Категории</span>
        </Tab>
        <Tab :value="3" class="flex items-center gap-2">
          <ChartNoAxesColumn />
          <span>Подкатегории</span>
        </Tab>
        <Tab :value="4" @click="pushTransactions" class="flex items-center gap-2">
          <Button><DoorOpen /> <span>Вернуться к транзакциям</span></Button>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel :value="0">
          <CreateStatus />
          <DataTable :value="statuses">
            <Column field="name" header="Название статуса"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="id" header="Управление">
              <template #body="slotProps">
                <EditStatus :id="slotProps.data.id" :name="slotProps.data.name" />
                <DeleteStatus :statusId="slotProps.data.id" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel :value="1">
          <CreateType />
          <DataTable :value="types">
            <Column field="name" header="Название типа операции"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="id" header="Управление">
              <template #body="slotProps">
                <EditType :id="slotProps.data.id" :name="slotProps.data.name" />
                <DeleteType :typeId="slotProps.data.id" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel :value="2">
          <CreateCategory />
          <DataTable :value="categories">
            <Column field="name" header="Название категории"></Column>
            <Column field="type.name" header="Относится к типу операции"></Column>
            <Column field="id" header="ID"></Column>
            <Column field="id" header="Управление">
              <template #body="slotProps">
                <EditType :id="slotProps.data.id" :name="slotProps.data.name" />
                <DeleteCategory :categoryId="slotProps.data.id" />
              </template>
            </Column>
          </DataTable>
        </TabPanel>
        <TabPanel :value="3">
          <DataTable :value="subcategories">
            <Column field="name" header="Название подкатегории"></Column>
            <Column field="category.name" header="Относится к категории"></Column>
            <Column field="id" header="ID"></Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped></style>
