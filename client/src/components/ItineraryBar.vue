<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '../stores/tripStore'

const store = useTripStore()
const router = useRouter()
const buttonState = ref('idle') 
const statusMessage = ref('')

const handleSave = async () => {
  buttonState.value = 'saving'
  
  const result = await store.saveTrip()
  
  if (result.success) {
    buttonState.value = 'success'
    setTimeout(() => {
      router.push('/my-vacations')
      buttonState.value = 'idle' 
    }, 1200)
  } else {
    buttonState.value = 'error'
    statusMessage.value = result.message || 'Eroare'
    setTimeout(() => { buttonState.value = 'idle' }, 3000)
  }
}
</script>

<template>
  <transition name="slide-up">
    <div v-if="store.itemsInCurrentDay.length > 0" class="itinerary-bar">
      <div class="bar-content">
        
        <div class="day-info">
          <span class="day-label">ZIUA {{ store.currentDay }}</span>
          <span class="count-label">{{ store.itemsInCurrentDay.length }} activități azi</span>
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
            Ziua Următoare
          </button>
          
          <button 
            @click="handleSave" 
            class="btn-save"
            :class="buttonState"
            :disabled="buttonState === 'saving' || buttonState === 'success'"
          >
             <span v-if="buttonState === 'idle'">Finalizează</span>
             <span v-else-if="buttonState === 'saving'">Se salvează...</span>
             <span v-else-if="buttonState === 'success'">Salvat!</span>
             <span v-else-if="buttonState === 'error'">⚠️ {{ statusMessage }}</span>
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<style scoped>
.itinerary-bar {
  position: fixed; bottom: 0; left: 0; width: 100%;
  background: rgba(44, 62, 80, 0.95); backdrop-filter: blur(10px);
  color: white; padding: 15px 20px;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.15); z-index: 1000;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.bar-content {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
}

.day-label { font-size: 1.1rem; font-weight: 800; color: #f1c40f; margin-right: 10px; }
.count-label { color: #bdc3c7; font-size: 0.85rem; }

.items-list {
  flex-grow: 1; display: flex; gap: 8px; overflow-x: auto; padding-bottom: 5px;
  mask-image: linear-gradient(to right, black 90%, transparent 100%);
}

.chip {
  background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 20px;
  white-space: nowrap; font-size: 0.85rem; display: flex; align-items: center; gap: 8px;
  border: 1px solid rgba(255,255,255,0.2); transition: 0.2s;
}
.chip:hover { background: rgba(255,255,255,0.2); }
.chip-time { color: #3498db; font-weight: bold; }
.close-btn { background: none; border: none; color: #ff6b6b; font-weight: bold; cursor: pointer; padding: 0 4px; }

.actions { display: flex; gap: 10px; }

.btn-next { 
  background: transparent; color: #3498db; border: 1px solid #3498db; 
  padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600; 
  transition: 0.2s;
}
.btn-next:hover { background: #3498db; color: white; }

.btn-save { 
  background: #27ae60; color: white; border: none; min-width: 120px;
  padding: 8px 20px; border-radius: 6px; cursor: pointer; font-weight: bold;
  transition: all 0.3s ease; display: flex; justify-content: center; align-items: center;
}
.btn-save:hover { background: #219150; transform: translateY(-1px); }

.btn-save.success { background: #2ecc71; transform: scale(1.05); }
.btn-save.error { background: #e74c3c; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>