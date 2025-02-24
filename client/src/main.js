import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

const app = createApp(App)
app.config.globalProperties.axios=axios

app.mount('#app')


