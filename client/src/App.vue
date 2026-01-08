<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ItineraryBar from './components/ItineraryBar.vue'
</script>

<template>
  <div class="app-wrapper">
    <nav>
      <div class="logo">✨ Wanderlust</div>
      
      <div class="links">
        <RouterLink to="/">Dashboard</RouterLink>
        
        <RouterLink to="/inspire" class="highlight-link">Inspiră-mă</RouterLink>
        
        <RouterLink to="/my-vacations">Vacanțele mele</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </div>
    </nav>

    <div class="main-content">
      <RouterView />
    </div>

    <ItineraryBar /> 
  </div>
</template>

<style>
body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; }

nav { 
  background: white; 
  padding: 15px 40px; 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
  position: sticky; 
  top: 0;
  z-index: 100;
}

.logo { 
  font-size: 1.8rem; 
  font-weight: 800; 
  color: #2c3e50; 
  letter-spacing: -1px;
  background: -webkit-linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.links a { 
  margin-left: 20px; 
  text-decoration: none; 
  color: #7f8c8d; 
  font-weight: 600; 
  transition: color 0.3s;
}

.links a:hover {
  color: #2c3e50;
}

.links a.router-link-active { 
  color: #3498db; 
}

.highlight-link { 
  color: #e67e22 !important; 
}
.highlight-link:hover {
  color: #d35400 !important;
}

.main-content {
  min-height: 80vh; 
}
</style>