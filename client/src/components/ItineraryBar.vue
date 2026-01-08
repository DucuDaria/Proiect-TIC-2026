<script setup>
import { useTripStore } from '../stores/tripStore'
const store = useTripStore()
</script>

<template>
  <transition name="slide-up">
    <div v-if="store.itemsInCurrentDay.length > 0" class="itinerary-bar">
      <div class="bar-content">
        
        <div class="day-info">
          <span class="day-label">ZIUA {{ store.currentDay }}</span>
          <span class="count-label">{{ store.itemsInCurrentDay.length }} obiective</span>
        </div>

        <div class="items-list">
          <div v-for="(item, index) in store.itemsInCurrentDay" :key="item.id" class="chip">
            <span class="chip-time">{{ item.time }}</span>
            <span class="chip-name">{{ item.name }}</span>
            <button @click="store.removeFromCurrentDay(index)" class="close-btn">×</button>
          </div>
        </div>

        <div class="actions">
          <button @click="store.nextDay" class="btn-next">
            Următoarea Zi 
          </button>
          
          <button @click="store.saveTrip" class="btn-save">
             Finalizează
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
.itinerary-bar {
  position: fixed; bottom: 0; left: 0; width: 100%;
  background-color: #2c3e50; color: white;
  padding: 15px 20px;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.2);
  z-index: 1000;
  border-top: 3px solid #3498db;
}

.bar-content {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}

.day-label { font-size: 1.2rem; font-weight: 800; color: #f1c40f; margin-right: 10px; }
.count-label { color: #bdc3c7; font-size: 0.9rem; }

.items-list {
  flex-grow: 1; display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px;
}

.chip {
  background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px;
  white-space: nowrap; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;
  border: 1px solid rgba(255,255,255,0.2);
}
.chip-time { color: #3498db; font-weight: bold; font-size: 0.8rem; }
.chip-name { font-weight: 500; }

.close-btn { 
  background: none; border: none; color: #ff6b6b; 
  font-weight: bold; cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 0 4px;
}
.close-btn:hover { color: #ff4757; }

.actions { display: flex; gap: 10px; }

.btn-next { 
  background: #3498db; color: white; border: none; 
  padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold; 
  transition: background 0.2s;
}
.btn-next:hover { background: #2980b9; }

.btn-save { 
  background: #27ae60; color: white; border: none; 
  padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;
  transition: background 0.2s;
}
.btn-save:hover { background: #219150; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>