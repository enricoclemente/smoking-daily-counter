import App from './App.vue';
import { createApp } from 'vue';
import axios from 'axios';
import router from './router';

axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3001';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  response => response,
  error => {
    console.log("Error by interceptor")
    console.log(error.response)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      // Ora il router è disponibile
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);

app.config.globalProperties.axios = axios;

app.use(router);
app.mount('#app');