import { createRouter, createWebHistory } from 'vue-router';

import UserDashboard from './components/UserDashboard.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';

const routes = [
    { path: '/login', component: UserLogin },
    { path: '/register', component: UserRegister },
    { path: '/dashboard', component: UserDashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
