<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth'; 
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const isLoading = ref(false); 
const errorMessage = ref(''); 

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    await authStore.login(email.value, password.value);
    router.push('/'); 
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="title">Bine ai revenit!</h1>
      <p class="subtitle">Loghează-te pentru a-ți vedea planurile de călătorie.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        
        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="nume@exemplu.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Parolă</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <div v-if="errorMessage" class="error-box">
          ⚠️ {{ errorMessage }}
        </div>

        <button type="submit" class="btn-login" :disabled="isLoading">
          {{ isLoading ? 'Se verifică...' : 'Intră în cont' }}
        </button>

      </form>

      <div class="footer-links">
        <p>Nu ai cont? <RouterLink to="/register" class="link-accent">Înregistrează-te</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8; /* Un gri-albăstrui deschis */
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.title {
  color: #2c3e50;
  margin-bottom: 5px;
  font-weight: 600;
}

.subtitle {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 0.85rem;
  color: #34495e;
  margin-bottom: 5px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box; 
}

input:focus {
  border-color: #3498db;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
}

.btn-login:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-login:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.error-box {
  background-color: #ffeaa7;
  color: #d63031;
  padding: 10px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 15px;
  border: 1px solid #fdcb6e;
}

.footer-links {
  margin-top: 25px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.link-accent {
  color: #3498db;
  font-weight: 600;
  text-decoration: none;
}

.btn-back {
  display: block;
  margin-top: 15px;
  color: #95a5a6;
  text-decoration: none;
  font-size: 0.85rem;
}
.btn-back:hover {
  color: #7f8c8d;
}
</style>