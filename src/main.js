import './assets/main.css'

import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import ToastService from 'primevue/toastservice'
import router from './router'

const app = createApp(App)

app.use(PrimeVue, {
  unstyled: true,
})
app.use(createPinia())
app.use(router)
app.use(ToastService)

app.mount('#app')
