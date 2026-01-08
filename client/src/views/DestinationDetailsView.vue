<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTripStore } from '../stores/tripStore'

const route = useRoute()
const tripStore = useTripStore()
const destination = ref(null)
const loading = ref(true)
const error = ref(null)

const showModal = ref(false)
const selectedTime = ref('')
const selectedAttraction = ref(null)
const selectedCityName = ref('')
const errorMessage = ref('') 


const openTimeModal = (attraction, cityName) => {
  selectedAttraction.value = attraction
  selectedCityName.value = cityName
  selectedTime.value = '' 
  errorMessage.value = '' 
  showModal.value = true  
}

const closeModal = () => {
  showModal.value = false
  selectedAttraction.value = null
  selectedCityName.value = ''
  errorMessage.value = ''
}

const confirmSelection = () => {
  errorMessage.value = '' 


  if (!selectedTime.value) {
    errorMessage.value = "Te rog să alegi o oră!"
    return
  }


  const conflict = tripStore.checkConflict(selectedTime.value)
  if (conflict) {
    // AFIȘĂM EROAREA ÎN FEREASTRĂ (NU ALERT)
    errorMessage.value = `Ora ocupată! Ai deja "${conflict.name}" la ${selectedTime.value}.`
    return // Oprim funcția, fereastra RĂMÂNE DESCHISĂ
  }


  tripStore.addToItinerary(
    selectedAttraction.value, 
    selectedCityName.value, 
    destination.value.country, 
    selectedTime.value
  )
  
 
  closeModal()
}

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await fetch(`http://localhost:3000/api/destinations/${id}`)
    if (!res.ok) throw new Error("Eroare server")
    const json = await res.json()
    destination.value = json.data
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="details-page">
    
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>Planificare</h3>
        <p>La ce oră vrei să vizitezi <br><strong>{{ selectedAttraction?.name }}</strong>?</p>
        
        <input type="time" v-model="selectedTime" class="big-time-input" />

        <div v-if="errorMessage" class="error-box">
          ⛔ {{ errorMessage }}
        </div>
        
        <div class="modal-actions">
          <button @click="closeModal" class="btn-cancel">Anulează</button>
          <button @click="confirmSelection" class="btn-confirm">Confirmă</button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Se încarcă...</div>
    <div v-else-if="error" class="error"> {{ error }}</div>
    
    <div v-else-if="destination">
      <header class="hero">
        <h1>Explorare: {{ destination.country }}</h1>
        <p>{{ destination.description }}</p>
      </header>

      <div v-for="city in destination.cities" :key="city.id" class="city-block">
        <div class="city-header">
          <img :src="city.image" class="city-img" />
          <h2> {{ city.name }}</h2>
        </div>

        <div class="attractions-grid">
          <div v-for="(attr, index) in city.attractions" :key="index" class="attraction-card">
            <div class="attr-info">
              <h3>{{ attr.name }}</h3>
              <span class="badge">{{ attr.type }}</span>
            </div>
            
            <div class="attr-footer">
              <span class="price">{{ attr.price }} €</span>
              <button @click="openTimeModal(attr, city.name)" class="btn-add">
                 Programează
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-page { max-width: 900px; margin: 0 auto; padding: 20px; }
.hero { text-align: center; margin-bottom: 40px; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.city-block { background: white; margin-bottom: 40px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.city-header { position: relative; height: 200px; }
.city-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6); }
.city-header h2 { position: absolute; bottom: 20px; left: 20px; color: white; font-size: 2rem; margin: 0; text-shadow: 0 2px 4px black; }

.attractions-grid { padding: 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
.attraction-card { border: 1px solid #eee; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between; }
.badge { font-size: 0.8rem; background: #e3f2fd; color: #1565c0; padding: 2px 6px; border-radius: 4px; }
.attr-footer { margin-top: 15px; display: flex; justify-content: space-between; align-items: center; }
.price { font-weight: bold; color: #2ecc71; font-size: 1.2rem; }
.btn-add { background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; transition: 0.2s; }
.btn-add:hover { background: #2980b9; }

.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
  z-index: 2000; backdrop-filter: blur(3px);
}
.modal-content {
  background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 400px;
  text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.big-time-input {
  font-size: 2rem; padding: 10px; margin: 15px 0; border: 2px solid #3498db; border-radius: 10px;
  color: #2c3e50; font-family: inherit; cursor: pointer;
}
.error-box {
  background: #ffebee; color: #c62828; padding: 10px; border-radius: 8px;
  margin-bottom: 20px; font-weight: bold; border: 1px solid #ef9a9a;
}
.modal-actions { display: flex; gap: 10px; justify-content: center; }
.btn-cancel { background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
.btn-confirm { background: #27ae60; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
.loading, .error { text-align: center; font-size: 1.5rem; margin-top: 50px; }
</style>