<script setup>
import { useTripStore } from '../stores/tripStore'
const store = useTripStore()
</script>

<template>
  <div class="itinerary-container">
    <h1> Planul meu de vacanță</h1>

    <div v-if="store.items.length === 0" class="empty-state">
      <p>Nu ai adăugat nimic încă.</p>
      <RouterLink to="/" class="btn-back">Mergi la destinații</RouterLink>
    </div>

    <div v-else>
      <div class="summary-card">
        <h3>Total Estimativ: {{ store.totalPrice.toFixed(2) }} €</h3>
        <p>Număr obiective: {{ store.items.length }}</p>
      </div>

      <div class="items-list">
        <div v-for="(item, index) in store.items" :key="item.id" class="item-card">
          <div class="info">
            <h3>{{ item.name }}</h3>
            <p>📍 {{ item.city }}, {{ item.country }}</p>
          </div>
          <div class="actions">
            <span class="price">{{ item.price }} €</span>
            <button @click="store.removeFromItinerary(index)" class="btn-delete">Șterge</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.itinerary-container { max-width: 600px; margin: 0 auto; padding: 20px; }
.summary-card { background: #34495e; color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
.item-card { 
  display: flex; justify-content: space-between; align-items: center; 
  background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee;
}
.btn-delete { background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.btn-back { display: inline-block; background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
</style>