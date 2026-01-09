<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import ItineraryBar from './components/ItineraryBar.vue' 

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
}
</script>

<template>
  <div class="app-wrapper">
    
    <nav v-if="authStore.isAuthenticated">
      <div class="logo">✨ Wanderlust</div>
      
      <div class="links">
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/inspire" class="highlight-link">Inspiră-mă</RouterLink>
        <RouterLink to="/my-vacations">Vacanțele mele</RouterLink>
        
        <div class="user-menu">
          <div class="user-info">
            <span class="avatar">{{ authStore.user?.email?.charAt(0).toUpperCase() }}</span>
            <span class="email-text">{{ authStore.user?.email }}</span>
          </div>
          <button @click="handleLogout" class="btn-logout">Ieșire</button>
        </div>
      </div>
    </nav>

    <div class="main-content">
      <RouterView />
    </div>
    
    <ItineraryBar v-if="authStore.isAuthenticated" />
  </div>
</template>

<style>
body { margin: 0; font-family: 'Segoe UI', sans-serif; background-color: #f4f7f6; }

nav { 
  background: white; 
  padding: 15px 30px; 
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
  position: sticky; top: 0; z-index: 100;
}

.logo { font-size: 1.6rem; font-weight: 800; color: #2c3e50; }

.links { display: flex; align-items: center; gap: 20px; }
.links a { text-decoration: none; color: #7f8c8d; font-weight: 600; transition: 0.3s; }
.links a:hover, .links a.router-link-active { color: #3498db; }
.highlight-link { color: #e67e22 !important; }

.user-menu { display: flex; align-items: center; gap: 15px; margin-left: 20px; border-left: 1px solid #ddd; padding-left: 20px; }
.user-info { display: flex; align-items: center; gap: 8px; }
.avatar { width: 32px; height: 32px; background: #3498db; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.email-text { font-size: 0.9rem; color: #2c3e50; font-weight: 500; }

.btn-logout { background: #ffeaa7; color: #d63031; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 700; transition: 0.2s; }
.btn-logout:hover { background: #ff7675; color: white; }

.main-content { min-height: 90vh; }
</style>