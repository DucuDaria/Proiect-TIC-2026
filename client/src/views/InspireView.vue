<script setup>
import { ref } from 'vue'

const suggestion = ref(null)
const loading = ref(false)

const surpriseMe = async () => {
  loading.value = true
  suggestion.value = null
  
  try {
    const res = await fetch('http://localhost:3000/api/destinations')
    const json = await res.json()
    const all = json.data.destinations
    
    setTimeout(() => {
      const random = all[Math.floor(Math.random() * all.length)]
      suggestion.value = random
      loading.value = false
    }, 1500)
    
  } catch (e) {
    console.error(e)
    loading.value = false
  }
}
</script>

<template>
  <div class="inspire-container">
    <h1>Nu știi unde să mergi? </h1>
    <p>Lasă-ne să alegem următoarea ta aventură!</p>

    <div class="action-area">
      <button @click="surpriseMe" class="magic-btn" :disabled="loading">
        {{ loading ? ' Se caută destinația perfectă...' : 'Surprinde-mă!' }}
      </button>
    </div>

    <div v-if="suggestion" class="ticket">
      <div class="ticket-left">
        <img :src="suggestion.image" alt="Dest" />
      </div>
      <div class="ticket-right">
        <h3>Bilet către:</h3>
        <h2>{{ suggestion.country }}</h2>
        <p>{{ suggestion.cities[0].name }} te așteaptă!</p>
        <div class="ticket-footer">
          <span>Clasa: AVENTURĂ</span>
          <RouterLink :to="'/destination/' + suggestion.id" class="btn-go">Vezi Detalii &rarr;</RouterLink>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.inspire-container { max-width: 700px; margin: 0 auto; text-align: center; padding: 50px 20px; }
.magic-btn { 
  background: linear-gradient(45deg, #FF512F, #DD2476); color: white; border: none; 
  padding: 15px 40px; font-size: 1.2rem; border-radius: 50px; cursor: pointer; 
  box-shadow: 0 10px 20px rgba(221, 36, 118, 0.3); transition: transform 0.2s; margin: 30px 0;
}
.magic-btn:hover { transform: scale(1.05); }
.magic-btn:disabled { opacity: 0.7; cursor: wait; }

.ticket { 
  display: flex; background: white; border-radius: 20px; overflow: hidden; 
  box-shadow: 0 15px 35px rgba(0,0,0,0.1); text-align: left; animation: popIn 0.5s ease;
}
.ticket-left { width: 40%; }
.ticket-left img { width: 100%; height: 100%; object-fit: cover; }
.ticket-right { width: 60%; padding: 30px; display: flex; flex-direction: column; justify-content: center; border-left: 2px dashed #eee; }
.ticket-right h2 { margin: 5px 0 15px 0; color: #2c3e50; font-size: 2.5rem; }
.ticket-footer { margin-top: 20px; display: flex; justify-content: space-between; align-items: center; }
.btn-go { background: #2c3e50; color: white; padding: 8px 15px; text-decoration: none; border-radius: 5px; }

@keyframes popIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>