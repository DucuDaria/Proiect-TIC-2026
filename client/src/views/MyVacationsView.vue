<script setup>
import { ref } from 'vue'
import { useTripStore } from '../stores/tripStore'
import html2pdf from 'html2pdf.js'

const store = useTripStore()
const isGenerating = ref(false)

const exportToPDF = (trip) => {
  isGenerating.value = true
  const element = document.getElementById(`trip-card-${trip.id}`)
  
  const opt = {
    margin:       10,
    filename:     `Jurnal_Calatorie_${trip.country}.pdf`,
    image:        { type: 'jpeg', quality: 0.99 }, // Calitate maximă pentru culori
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
      <h1 class="page-title"> Jurnalul de călătorie</h1>
      <p class="subtitle">Planurile tale de vacanță, acum într-un singur loc.</p>
    </div>

    <div v-if="store.savedVacations.length === 0" class="empty-state">
      <div class="empty-icon"></div>
      <h3>Încă nu ai nicio aventură planificată.</h3>
      <RouterLink to="/" class="btn-start">Începe Aventura</RouterLink>
    </div>

    <div v-else class="vacations-list">
      <div v-for="trip in store.savedVacations" :key="trip.id" class="trip-wrapper">
        
        <div :id="`trip-card-${trip.id}`" class="printable-area aesthetic-card">
          
          <div class="ticket-header-gradient">
            <div class="header-content-overlay">
              <div class="logo-area">
                <span class="brand-icon"></span>
                <div>
                    <span class="brand-name">WANDERLUST</span>
                    <span class="brand-sub">Travel Journal</span>
                </div>
              </div>
              <div class="ticket-meta">
                <span class="meta-label">BOOKING ID</span>
                <span class="meta-value">#{{ trip.id.toString().slice(-6) }}</span>
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
                <span class="p-type"> Solo</span>
                <span class="p-val highlight-blue">{{ trip.totalPrice.toFixed(0) }} €</span>
              </div>
              <div class="divider"></div>
              <div class="price-item">
                <span class="p-type"> Cuplu</span>
                <span class="p-val">{{ (trip.totalPrice * 2).toFixed(0) }} €</span>
              </div>
              <div class="divider"></div>
              <div class="price-item">
                <span class="p-type"> Familie (4)</span>
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
                      <div class="event-city"> {{ item.city }}</div>
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
            <div class="section-header-small">Note și detalii</div>
            <div class="aesthetic-notes-box">
              <textarea 
                v-model="trip.notes" 
                placeholder="Nu uita să..." 
                class="notes-input"
              ></textarea>
            </div>
          </div>

          <div class="doc-footer-styled">
            Created by Wanderlust 
          </div>
        </div>

        <div class="actions-row">
          <button @click="exportToPDF(trip)" class="btn-pdf-gradient" :disabled="isGenerating">
            {{ isGenerating ? ' Se generează PDF...' : 'Descarcă PDF ' }}
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
    background-color: #f4f7f9; /* Fundal pagină ușor gri-albăstrui */
}
.header-section { text-align: center; margin-bottom: 40px; }
.page-title { font-weight: 700; color: #2c3e50; margin: 0; font-size: 2.2rem; letter-spacing: -0.5px; }
.subtitle { color: #607d8b; margin-top: 5px; font-size: 1rem; }

.trip-wrapper { margin-bottom: 60px; }

.aesthetic-card {
  background: white;
  border-radius: 16px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.08); 
  overflow: hidden;
  position: relative;
  border: none; /* Scoatem bordura simplă */
}


.ticket-header-gradient {
  background: linear-gradient(135deg, #006266, #00a8ff);
  color: white; 
  padding: 25px 40px;
  position: relative;
}

.ticket-header-gradient::before {
    content: '';
    position: absolute; top:0; left:0; right:0; bottom:0;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
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
.meta-value { font-family: 'Poppins', monospace; font-size: 1.1rem; font-weight: 600; letter-spacing: 1px; }


.trip-hero {
  padding: 30px 40px 25px; 
}
.destination-title { 
  font-size: 3rem; 
  margin: 0 0 15px 0; 
  color: #2c3e50; 
  text-transform: uppercase; 
  letter-spacing: -1.5px; 
  font-weight: 800;
  line-height: 1;
  background: -webkit-linear-gradient(45deg, #2c3e50, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.trip-info-row { display: flex; gap: 12px; }
.info-badge { 
  font-size: 0.85rem; 
  padding: 6px 14px; 
  border-radius: 20px; 
  font-weight: 600;
  display: inline-flex; align-items: center;
}
.blue-badge { background: #e3f2fd; color: #1565c0; }
.green-badge { background: #e8f5e9; color: #2e7d32; }

.price-compact-section {
  margin: 0 40px 30px; 
  padding: 15px 25px;
  background-color: #f8f9fa; 
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #edf2f7;
}
.price-label-box {
  font-size: 0.75rem; font-weight: 700; color: #607d8b; letter-spacing: 0.5px; text-transform: uppercase; display: flex; align-items: center;
}
.price-icon { font-size: 1rem; margin-right: 5px; }

.price-row { display: flex; align-items: center; gap: 25px; }
.price-item { display: flex; flex-direction: column; align-items: flex-end; }
.p-type { font-size: 0.75rem; color: #90a4ae; margin-bottom: 2px; font-weight: 500; }
.p-val { font-weight: 700; color: #455a64; font-size: 1.1rem; }
.highlight-blue { color: #00a8ff; } 
.divider { width: 1px; height: 30px; background: #e0e0e0; }


.itinerary-section { padding: 0 40px 30px; }
.day-container { margin-bottom: 35px; }


.day-header-styled {
    display: flex; align-items: center; margin-bottom: 15px;
}
.day-number {
  font-size: 0.9rem; font-weight: 700; color: #00a8ff; 
  text-transform: uppercase; margin-right: 15px; white-space: nowrap;
}
.day-line { height: 2px; background: #e3f2fd; flex-grow: 1; border-radius: 2px; }

.timeline { display: flex; flex-direction: column; gap: 12px; }
.timeline-item { 
  display: flex; align-items: center; 
  padding: 12px;
  background: white; border-radius: 8px;
  border: 1px solid #f0f0f0; /* Chenar foarte fin */
  transition: box-shadow 0.2s;
}

.time-col { width: 60px; font-size: 0.9rem; color: #607d8b; font-weight: 600; }
.event-col { flex-grow: 1; padding-right: 15px; }
.event-name { font-weight: 600; font-size: 1rem; color: #2c3e50; margin-bottom: 3px;}
.event-city { font-size: 0.85rem; color: #90a4ae; }

.price-col { text-align: right; }
.price-tag-pill {
    background: #e0f7fa; color: #0097a7; font-weight: 700; font-size: 0.85rem;
    padding: 4px 10px; border-radius: 12px;
}

.notes-wrapper { padding: 0 40px 40px; }

.section-header-small { 
  font-size: 0.75rem; 
  font-weight: 700; 
  color: #546e7a; 
  margin-bottom: 12px; 
  letter-spacing: 1px; 
  text-transform: uppercase; 
}

.aesthetic-notes-box {
  background: #e0f7fa; 
  border: 2px solid #80deea; 
  padding: 20px;
  border-radius: 12px;
}
.notes-input {
  width: 100%; height: 80px; border: none; background: transparent;
  font-family: 'Poppins', sans-serif; font-size: 0.95rem; color: #5d4037; resize: none; outline: none;
  line-height: 1.5;
}
.notes-input::placeholder { color: #d7ccc8; }

.doc-footer-styled { text-align: center; padding: 20px; font-size: 0.75rem; color: #b0bec5; background: #fcfdfe; border-top: 1px solid #f0f0f0; }

.actions-row { text-align: right; margin-top: 20px; padding-right: 10px; }
.btn-pdf-gradient {
  background: linear-gradient(135deg, #006266, #00a8ff);
  color: white; border: none; padding: 12px 28px; border-radius: 50px;
  font-weight: 600; font-size: 0.95rem; cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 168, 255, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-pdf-gradient:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 168, 255, 0.4); }
.btn-pdf-gradient:disabled { background: #ccc; box-shadow: none; transform: none;}

.empty-state { text-align: center; margin-top: 60px; color: #7f8c8d; }
.btn-start { background: #2c3e50; color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 15px; }
</style>