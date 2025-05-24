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
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Esempio: redirect a login se non autorizzato
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


const app = createApp(App);

app.config.globalProperties.axios = axios;

app.use(router);
app.mount('#app');