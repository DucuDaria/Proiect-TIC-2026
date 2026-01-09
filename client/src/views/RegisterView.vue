<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  errorMessage.value = '';

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Parolele nu coincid!';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Parola trebuie să aibă minim 6 caractere.';
    return;
  }

  isLoading.value = true;

  try {
    await authStore.register(email.value, password.value);
    router.push('/');
  } catch (error) {
    if (error.message.includes('email-already-in-use')) {
      errorMessage.value = 'Acest email este deja folosit.';
    } else {
      errorMessage.value = error.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1 class="title">Creează cont nou</h1>
      <p class="subtitle">Începe aventura ta cu Wanderlust!</p>

      <form @submit.prevent="handleRegister" class="register-form">
        
        <div class="form-group">
          <label>Numele tău</label>
          <input 
            v-model="name" 
            type="text" 
            placeholder="Ex: Daria Ducu" 
          />
        </div>

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
            placeholder="Minim 6 caractere" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Confirmă parola</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Repetă parola" 
            required 
          />
        </div>

        <div v-if="errorMessage" class="error-box">
          ⚠️ {{ errorMessage }}
        </div>

        <button type="submit" class="btn-register" :disabled="isLoading">
          {{ isLoading ? 'Se creează contul...' : 'Înregistrează-te' }}
        </button>

      </form>

      <div class="footer-links">
        <p>Ai deja un cont? <RouterLink to="/login" class="link-accent">Loghează-te aici</RouterLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8;
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 450px; 
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
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 15px;
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
  border-color: #2ecc71;
}

.btn-register {
  width: 100%;
  padding: 12px;
  background-color: #2ecc71; 
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 15px;
}

.btn-register:hover:not(:disabled) {
  background-color: #27ae60;
}

.btn-register:disabled {
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
  color: #2ecc71;
  font-weight: 600;
  text-decoration: none;
}
</style>