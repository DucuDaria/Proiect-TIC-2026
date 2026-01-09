<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import html2pdf from 'html2pdf.js'

const vacations = ref([]);
const isLoading = ref(true);
const isGenerating = ref(false);
const authStore = useAuthStore();

const fetchMyVacations = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/destinations/my-vacations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}` 
      }
    });

    if (!response.ok) throw new Error("Eroare la încărcare");
    
    const result = await response.json();
    vacations.value = result.data.reverse(); 
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchMyVacations();
});

const exportToPDF = (trip) => {
  isGenerating.value = true
  const element = document.getElementById(`trip-card-${trip.id}`)
  
  const opt = {
    margin:       10,
    filename:     `Jurnal_${trip.country}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(() => {
    isGenerating.value = false
  })
}
</script>

<template>
  <div class="page-container">
    <div class="header-section">
      <h1 class="page-title">Jurnal de călătorie ✈️</h1>
      <p class="subtitle">Toate aventurile tale, într-un singur loc.</p>
    </div>

    <div v-if="isLoading" class="empty-state">
      <h3>Se încarcă vacanțele...</h3>
    </div>

    <div v-else-if="vacations.length === 0" class="empty-state">
      <div class="empty-icon">🧳</div>
      <h3>Încă nu ai nicio aventură planificată.</h3>
      <RouterLink to="/inspire" class="btn-start">Inspiră-mă</RouterLink>
    </div>

    <div v-else class="vacations-list">
      <div v-for="trip in vacations" :key="trip.id" class="trip-wrapper">
        
        <div :id="`trip-card-${trip.id}`" class="printable-area aesthetic-card">
          
          <div class="ticket-header-gradient">
            <div class="header-content-overlay">
              <div class="logo-area">
                <span class="brand-icon">✈️</span>
                <div>
                    <span class="brand-name">WANDERLUST</span>
                    <span class="brand-sub">Travel journal</span>
                </div>
              </div>
              <div class="ticket-meta">
                <span class="meta-label">BOOKING ID</span>
                <span class="meta-value">#{{ trip.id.toString().slice(0, 6).toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <div class="trip-hero">
            <h2 class="destination-title">{{ trip.country }}</h2>
            <div class="trip-info-row">
              <span class="info-badge blue-badge"> {{ trip.totalDays }} Zile</span>
              <span class="info-badge green-badge"> Itinerariu complet</span>
            </div>
          </div>
            
          <div class="price-compact-section">
            <div class="price-label-box">
                <span class="price-icon"></span> Costuri estimate
            </div>
            <div class="price-row">
              <div class="price-item">
                <span class="p-type">Solo</span>
                <span class="p-val highlight-blue">{{ trip.totalPrice }} €</span>
              </div>
              <div class="divider"></div>
              <div class="price-item">
                <span class="p-type">Cuplu</span>
                <span class="p-val">{{ (trip.totalPrice * 2).toFixed(0) }} €</span>
              </div>
              <div class="divider"></div>
              <div class="price-item">
                <span class="p-type">Familie (4)</span>
                <span class="p-val">{{ (trip.totalPrice * 4).toFixed(0) }} €</span>
              </div>
            </div>
          </div>

          <div class="itinerary-section">
            <div v-for="(items, day) in trip.itinerary" :key="day">
              <div v-if="items.length > 0" class="day-container">
                <div class="day-header-styled">
                    <span class="day-number">ZIUA {{ day }}</span>
                    <span class="day-line"></span>
                </div>
                
                <div class="timeline">
                  <div v-for="item in items" :key="item.id" class="timeline-item">
                    <div class="time-col">{{ item.time }}</div>
                    <div class="event-col">
                      <div class="event-name">{{ item.name }}</div>
                      <div class="event-city">📍 {{ item.city }}</div>
                    </div>
                    <div class="price-col">
                        <span class="price-tag-pill">{{ item.price }} €</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="notes-wrapper">
            <div class="section-header-small">Jurnal și notițe personale</div>
            <div class="aesthetic-notes-box">
               <textarea 
                  v-model="trip.notes" 
                  class="pdf-editable-textarea"
                  placeholder="Scrie aici... (ex: Zbor la ora 14:00, Nu uita pașaportul!)"
               ></textarea>
            </div>
          </div>

          <div class="doc-footer-styled">
            Generat de Wanderlust Planner pentru {{ authStore.user?.email }} 
          </div>
        </div>

        <div class="actions-row">
          <button @click="exportToPDF(trip)" class="btn-pdf-gradient" :disabled="isGenerating">
            {{ isGenerating ? 'Se generează...' : 'Descarcă PDF' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.page-container { 
    max-width: 850px; 
    margin: 0 auto; 
    padding: 40px 20px; 
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    color: #333; 
    background-color: #f4f7f9; 
}
.header-section { text-align: center; margin-bottom: 40px; }
.page-title { font-weight: 700; color: #2c3e50; font-size: 2.2rem; margin: 0; }
.subtitle { color: #607d8b; margin-top: 5px; }

.trip-wrapper { margin-bottom: 60px; }
.aesthetic-card {
  background: white;
  border-radius: 16px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
  overflow: hidden;
  position: relative;
  border: none;
}

.ticket-header-gradient {
  background: linear-gradient(135deg, #006266, #00a8ff); /* Gradient colorat */
  color: white; 
  padding: 25px 40px;
  position: relative;
}

.ticket-header-gradient::before {
    content: '';
    position: absolute; top:0; left:0; right:0; bottom:0;
    background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 10px 10px;
    opacity: 0.5;
}

.header-content-overlay {
    position: relative; z-index: 2;
    display: flex; 
    justify-content: space-between; 
    align-items: center;
}

.logo-area { display: flex; align-items: center; gap: 10px; }
.brand-icon { font-size: 1.8rem; }
.brand-name { font-weight: 700; font-size: 1.2rem; letter-spacing: 1px; display: block; line-height: 1; }
.brand-sub { font-weight: 300; font-size: 0.75rem; opacity: 0.8; letter-spacing: 0.5px; display: block; }

.ticket-meta { text-align: right; }
.meta-label { display: block; font-size: 0.65rem; opacity: 0.7; letter-spacing: 1px; text-transform: uppercase; }
.meta-value { font-family: monospace; font-size: 1.1rem; font-weight: 600; letter-spacing: 1px; }

.trip-hero { padding: 30px 40px 20px; }
.destination-title { 
  font-size: 3rem; margin: 0 0 10px 0; color: #2c3e50; 
  text-transform: uppercase; letter-spacing: -1.5px; font-weight: 800;
  background: -webkit-linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.trip-info-row { display: flex; gap: 12px; }
.info-badge { 
  font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; font-weight: 600;
}
.blue-badge { background: #e3f2fd; color: #1565c0; }
.green-badge { background: #e8f5e9; color: #2e7d32; }


.price-compact-section {
  margin: 0 40px 30px; padding: 15px 25px;
  background-color: #f8f9fa; border-radius: 12px;
  display: flex; align-items: center; justify-content: space-between;
  border: 1px solid #edf2f7;
}
.price-label-box { font-size: 0.75rem; font-weight: 700; color: #607d8b; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
.price-icon { font-size: 1.2rem; }
.price-row { display: flex; align-items: center; gap: 25px; }
.price-item { display: flex; flex-direction: column; align-items: flex-end; }
.p-type { font-size: 0.75rem; color: #90a4ae; margin-bottom: 2px; font-weight: 500; }
.p-val { font-weight: 700; color: #455a64; font-size: 1.1rem; }
.highlight-blue { color: #00a8ff; } 
.divider { width: 1px; height: 30px; background: #e0e0e0; }

.itinerary-section { padding: 0 40px 20px; }
.day-container { margin-bottom: 25px; }
.day-header-styled { display: flex; align-items: center; margin-bottom: 15px; }
.day-number { font-size: 0.9rem; font-weight: 700; color: #00a8ff; margin-right: 15px; white-space: nowrap; }
.day-line { height: 2px; background: #e3f2fd; flex-grow: 1; }

.timeline-item { 
  display: flex; align-items: center; padding: 10px;
  background: white; border-bottom: 1px solid #f0f0f0; 
}
.time-col { width: 60px; font-size: 0.9rem; color: #607d8b; font-weight: 600; }
.event-col { flex-grow: 1; padding-right: 15px; }
.event-name { font-weight: 600; font-size: 1rem; color: #2c3e50; }
.event-city { font-size: 0.85rem; color: #90a4ae; }
.price-tag-pill { background: #e0f7fa; color: #0097a7; font-weight: 700; font-size: 0.85rem; padding: 4px 10px; border-radius: 12px; }

.notes-wrapper { padding: 0 40px 40px; page-break-inside: avoid; }
.section-header-small { 
  font-size: 0.75rem; font-weight: 700; color: #546e7a; 
  margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; 
}
.aesthetic-notes-box {
  background: #fff; 
  border: 2px solid #80deea; /* Chenar colorat */
  padding: 0; 
  border-radius: 12px;
  overflow: hidden;
  background-color: #e0f7fa; /* Fundal ușor colorat */
}

.pdf-editable-textarea {
  width: 100%;
  min-height: 120px;
  border: none;
  padding: 15px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  color: #2c3e50;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  background: transparent;
}
.pdf-editable-textarea:focus {
  background: #ffffff; /* Se face alb când scrii */
}
.pdf-editable-textarea::placeholder {
  color: #a0bec4;
  font-style: italic;
}

.doc-footer-styled { 
    text-align: center; padding: 20px; font-size: 0.75rem; color: #b0bec5; 
    background: #fcfdfe; border-top: 1px solid #f0f0f0; 
}

.actions-row { text-align: right; margin-top: 20px; }
.btn-pdf-gradient {
  background: linear-gradient(135deg, #006266, #00a8ff);
  color: white; border: none; padding: 12px 28px; 
  border-radius: 50px; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 168, 255, 0.3); transition: transform 0.2s;
}
.btn-pdf-gradient:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 168, 255, 0.4); }
.btn-pdf-gradient:disabled { background: #ccc; box-shadow: none; transform: none; }

.empty-state { text-align: center; margin-top: 60px; color: #7f8c8d; }
.empty-icon { font-size: 4rem; margin-bottom: 10px; }
.btn-start { background: #2c3e50; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 15px; }
</style>