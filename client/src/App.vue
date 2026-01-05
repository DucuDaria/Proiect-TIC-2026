<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <nav style="padding: 20px; background: #f0f0f0; margin-bottom: 20px;">
      <RouterLink to="/" style="margin-right: 15px; font-weight: bold;">Dashboard </RouterLink> | 
      <RouterLink to="/login" style="margin-left: 15px; font-weight: bold;">Login </RouterLink>
    </nav>

    <main style="padding: 20px;">
      <RouterView />
    </main>
  </div>
</template>