<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit">🔐 Accedi</button>
      </form>
      <p>Non hai un account? <router-link to="/register">Registrati</router-link></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data: () => ({ email: '', password: '' }),
  methods: {
    async login() {
      try {
        const res = await axios.post('/api/login', {
          email: this.email, password: this.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('nickname', res.data.nickname);
        this.$router.push('/');
      } catch (e) {
        alert('Login fallito');
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

.auth-box {
  background: white;
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  text-align: center;
}

.auth-box h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.auth-box input {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  box-sizing: border-box;
}

.auth-box button {
  width: 100%;
  padding: 12px;
  background: #48bb78;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.auth-box button:hover {
  background: #38a169;
}

/* 📱 Media query per mobile più piccoli */
@media (max-width: 480px) {
  .auth-box {
    padding: 20px;
  }

  .auth-box h2 {
    font-size: 20px;
  }

  .auth-box input,
  .auth-box button {
    font-size: 14px;
  }
}
</style>
