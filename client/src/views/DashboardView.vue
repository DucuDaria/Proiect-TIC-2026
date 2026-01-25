<script setup>
import { ref, onMounted, computed } from 'vue'
import TripCard from '../components/TripCard.vue'

const destinations = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('') 

const filteredDestinations = computed(() => {
  return destinations.value.filter(dest => 
    dest.country.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/destinations')
    if (!response.ok) throw new Error('Nu am putut conecta serverul')
    const result = await response.json()
    destinations.value = result.data.destinations
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="dashboard-container">
    <header class="page-header">
      <h1>Explorează lumea</h1>
      <p>Alege o destinație și creează-ți propriul itinerariu.</p>

      <div class="search-wrapper">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Caută o țară (ex: Japonia)..." 
          class="search-input"
        />
      </div>
    </header>

    <div v-if="loading" class="status-msg">Se încarcă...</div>
    <div v-else-if="error" class="status-msg error"> {{ error }}</div>

    <div v-else class="grid">
      <TripCard 
        v-for="dest in filteredDestinations" 
        :key="dest.id"
        :country="dest.country"
        :description="dest.description"
        :image="dest.image" 
      >
        <RouterLink :to="'/destination/' + dest.id" class="btn-simple">
          Planifică-ți călătoria &rarr;
        </RouterLink>
      </TripCard>

      <div v-if="filteredDestinations.length === 0" class="no-results">
        Nu am găsit nicio destinație pentru "<strong>{{ searchQuery }}</strong>".
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container { 
  padding: 40px 20px; 
  max-width: 1200px; 
  margin: 0 auto; 
}

.page-header { 
  text-align: center; 
  margin-bottom: 50px; 
}

.page-header h1 { 
  font-size: 2.5rem; 
  color: #2c3e50; 
  margin-bottom: 10px; 
}

.page-header p {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin-bottom: 25px;
}

.search-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid #ecf0f1;
  border-radius: 30px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.search-input:focus {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.btn-simple {
  display: block; 
  text-align: center; 
  background-color: transparent;
  color: #3498db;
  border: 2px solid #3498db;
  padding: 10px; 
  border-radius: 8px; 
  text-decoration: none; 
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-simple:hover { 
  background-color: #3498db;
  color: white;
  transform: translateY(-2px);
}

.status-msg { text-align: center; font-size: 1.5rem; margin-top: 50px; color: #7f8c8d; }
.error { color: #e74c3c; }

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  color: #95a5a6;
  font-size: 1.2rem;
  margin-top: 30px;
}
</style>