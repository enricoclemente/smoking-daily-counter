import { createRouter, createWebHistory } from 'vue-router';

import UserDashboard from './components/UserDashboard.vue';
import UserRegister from './components/UserRegister.vue';
import UserLogin from './components/UserLogin.vue';

const routes = [
    { path: '/', component: UserDashboard, meta: { requiresAuth: true }},
    { path: '/login', component: UserLogin },
    { path: '/register', component: UserRegister }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

function isTokenExpired(token) {
  if (!token) return true;
  
  try {
    // Decodifica il payload del JWT (parte centrale)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Verifica se esiste il campo 'exp' (expiration time)
    if (!payload.exp) return false;
    
    // Confronta con il timestamp attuale (in secondi)
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Errore nella decodifica del token:', error);
    return true; // Se non riesco a decodificare, considero il token scaduto
  }
}

function checkAuthStatus() {
  const token = localStorage.getItem('token')
  return token && !isTokenExpired(token)
}

// Navigation Guard
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path)
  console.log('Requires auth:', to.meta.requiresAuth)
  
  const isAuthenticated = checkAuthStatus()
  console.log('Is authenticated:', isAuthenticated)
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login')
    next('/login')
  } else {
    next()
  }
})
  

export default router;
