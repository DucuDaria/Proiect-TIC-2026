<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useVacationStore } from '../stores/vacations'
import html2pdf from 'html2pdf.js'

const authStore = useAuthStore();
const vacationStore = useVacationStore();

const isGenerating = ref(false);
const editingId = ref(null);
const isCreating = ref(false); 
const editForm = ref({}); 
const errors = ref({});
const formStatus = ref('');

const currentEditTotal = computed(() => {
  if (!editForm.value.itinerary) return 0;
  let total = 0;
  Object.values(editForm.value.itinerary).forEach(dayItems => {
    dayItems.forEach(item => {
      total += Number(item.price) || 0;
    });
  });
  return total;
});

onMounted(() => {
  vacationStore.fetchVacations();
});

const startCreate = () => {
  isCreating.value = true;
  editingId.value = 'NEW';
  errors.value = {};
  formStatus.value = '';
  editForm.value = {
    country: '',
    totalDays: 3,
    totalPrice: 0,
    itinerary: { "1": [] }, 
    notes: ''
  };
  setTimeout(() => {
    const el = document.getElementById('create-area');
    if(el) el.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

const startEdit = (trip) => {
  isCreating.value = false;
  editingId.value = trip.id;
  errors.value = {};
  formStatus.value = '';
  editForm.value = JSON.parse(JSON.stringify(trip));
}

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!editForm.value.country || editForm.value.country.trim().length < 3) {
    errors.value.country = "Minim 3 caractere";
    isValid = false;
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (editForm.value.itinerary) {
    Object.entries(editForm.value.itinerary).forEach(([day, items]) => {
      items.forEach((item, idx) => {
        if (!timeRegex.test(item.time)) {
          if(!errors.value[day]) errors.value[day] = {};
          errors.value[day][idx] = { ...errors.value[day]?.[idx], time: "HH:MM" };
          isValid = false;
        }
        if (!item.name || item.name.trim() === '') {
          if(!errors.value[day]) errors.value[day] = {};
          errors.value[day][idx] = { ...errors.value[day]?.[idx], name: "Obligatoriu" };
          isValid = false;
        }
        if (item.price < 0 || item.price === "") {
          if(!errors.value[day]) errors.value[day] = {};
          errors.value[day][idx] = { ...errors.value[day]?.[idx], price: "Invalid" };
          isValid = false;
        }
      });
    });
  }

  return isValid;
}

const saveTrip = async () => {
  formStatus.value = '';
  if (!validateForm()) {
    formStatus.value = 'Verifică câmpurile marcate cu roșu.';
    return;
  }

  try {
    editForm.value.totalPrice = currentEditTotal.value;

    if (isCreating.value) {
      await vacationStore.addVacation(editForm.value);
    } else {
      await vacationStore.updateVacation(editForm.value.id, editForm.value);
    }
    cancelEdit();
  } catch (e) {
    alert("Eroare server: " + e.message);
  }
}

const deleteTrip = async (id) => {
  if (!confirm("Sigur vrei să ștergi vacanța?")) return;
  try {
    await vacationStore.deleteVacation(id);
  } catch (e) {
    alert(e.message);
  }
}

const cancelEdit = () => {
  editingId.value = null;
  isCreating.value = false;
  editForm.value = {};
  errors.value = {};
  formStatus.value = '';
}

const addActivity = (dayKey) => {
  if (!editForm.value.itinerary[dayKey]) {
    editForm.value.itinerary[dayKey] = [];
  }
  editForm.value.itinerary[dayKey].push({
    id: Date.now(),
    time: '10:00',
    name: '',
    city: '', 
    price: 0
  });
}

const removeActivity = (dayKey, index) => {
  editForm.value.itinerary[dayKey].splice(index, 1);
}

const addDay = () => {
  const currentDays = Object.keys(editForm.value.itinerary).length;
  editForm.value.itinerary[(currentDays + 1).toString()] = [];
  editForm.value.totalDays = currentDays + 1;
}

const exportToPDF = (trip) => {
  isGenerating.value = true;
  const element = document.getElementById(`trip-card-${trip.id}`);
  const opt = {
    margin: 10,
    filename: `Jurnal_${trip.country}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save().then(() => isGenerating.value = false);
}
</script>

<template>
  <div class="page-container">
    <div class="header-section">
      <h1 class="page-title">Jurnal de călătorie</h1>
      <p class="subtitle">Gestionează aventurile tale.</p>
      
      <button @click="startCreate" class="btn-create-main" v-if="!isCreating">
        + Adaugă Vacanță Nouă
      </button>
    </div>

    <div v-if="isCreating" id="create-area" class="trip-wrapper creating-mode">
      <div class="printable-area aesthetic-card">
        <div class="ticket-header-gradient new-entry">
          <div class="header-content-overlay">
            <span class="brand-name">INTRARE NOUĂ</span>
            <span class="brand-sub">Completează detaliile</span>
          </div>
        </div>
        
        <div class="trip-hero">
          <div class="edit-hero">
             <label class="edit-label">Destinație</label>
             <input 
               v-model="editForm.country" 
               class="input-edit-lg" 
               :class="{ 'error-input': errors.country }"
               placeholder="Ex: Grecia"
             >
             <span v-if="errors.country" class="error-hint">{{ errors.country }}</span>
          </div>
        </div>

        <div class="itinerary-section">
          <div v-for="(items, day) in editForm.itinerary" :key="day">
            <div class="day-container">
              <div class="day-header-styled">
                  <span class="day-number">ZIUA {{ day }}</span>
                  <span class="day-line"></span>
              </div>
              <div class="timeline">
                <div v-for="(item, idx) in items" :key="idx" class="timeline-item">
                    <div class="edit-row">
                      <div class="edit-col small">
                        <label>Oră</label>
                        <input v-model="item.time" class="input-edit-sm" :class="{ 'error-input': errors[day]?.[idx]?.time }">
                      </div>
                      <div class="edit-col grow">
                        <label>Activitate</label>
                        <input v-model="item.name" class="input-edit" :class="{ 'error-input': errors[day]?.[idx]?.name }">
                      </div>
                      <div class="edit-col grow">
                          <label>Oraș</label>
                          <input v-model="item.city" class="input-edit">
                      </div>
                      <div class="edit-col small">
                        <label>Preț</label>
                        <input type="number" v-model="item.price" class="input-edit-sm" min="0" :class="{ 'error-input': errors[day]?.[idx]?.price }">
                      </div>
                      <button @click="removeActivity(day, idx)" class="btn-remove-item">&times;</button>
                    </div>
                </div>
              </div>
              <div class="add-activity-wrapper">
                <button @click="addActivity(day)" class="btn-add-activity">Adaugă activitate</button>
              </div>
            </div>
          </div>
          <button @click="addDay" class="btn-dashed mt-2">+ Adaugă Ziua Următoare</button>
        </div>

        <div class="actions-row">
          <span v-if="formStatus" class="status-msg">{{ formStatus }}</span>
          <button @click="saveTrip" class="btn-action save">Creează Vacanța</button>
          <button @click="cancelEdit" class="btn-action cancel">Anulează</button>
        </div>
      </div>
    </div>

    <div v-if="vacationStore.isLoading" class="empty-state">
      <h3>Se încarcă...</h3>
    </div>

    <div v-else-if="vacationStore.vacations.length === 0 && !isCreating" class="empty-state">
      <h3>Nu ai vacanțe salvate.</h3>
    </div>

    <div v-else class="vacations-list">
      <div v-for="trip in vacationStore.vacations" :key="trip.id" class="trip-wrapper">
        
        <div :id="`trip-card-${trip.id}`" class="printable-area aesthetic-card">
          <div class="ticket-header-gradient">
            <div class="header-content-overlay">
              <div class="logo-area">
                <span class="brand-name">WANDERLUST</span>
                <span class="brand-sub">Travel journal</span>
              </div>
              <div class="ticket-meta">
                <span class="meta-label">ID</span>
                <span class="meta-value">#{{ trip.id.toString().slice(0, 6).toUpperCase() }}</span>
              </div>
            </div>
          </div>

          <div class="trip-hero">
            <div v-if="editingId !== trip.id">
              <h2 class="destination-title">{{ trip.country }}</h2>
            </div>
            <div v-else class="edit-hero">
               <label class="edit-label">Destinație</label>
               <input v-model="editForm.country" class="input-edit-lg" :class="{ 'error-input': errors.country }">
               <span v-if="errors.country" class="error-hint">{{ errors.country }}</span>
            </div>

            <div class="trip-info-row">
              <span class="info-badge blue-badge">{{ trip.totalDays }} Zile</span>
              <span class="info-badge green-badge">Confirmat</span>
            </div>
          </div>
            
          <div class="price-compact-section">
            <div class="price-label-box">Costuri estimate</div>
            <div class="price-row">
              <div class="price-item">
                <span class="p-type">Total</span>
                <span v-if="editingId !== trip.id" class="p-val highlight-blue">{{ trip.totalPrice }} €</span>
                <span v-else class="p-val highlight-blue">{{ currentEditTotal }} €</span>
              </div>
            </div>
          </div>

          <div class="itinerary-section">
            <div v-for="(items, day) in (editingId === trip.id ? editForm.itinerary : trip.itinerary)" :key="day">
              <div v-if="(items && items.length > 0) || editingId === trip.id" class="day-container">
                <div class="day-header-styled">
                    <span class="day-number">ZIUA {{ day }}</span>
                    <span class="day-line"></span>
                </div>
                <div class="timeline">
                  <div v-for="(item, idx) in items" :key="idx" class="timeline-item">
                    <template v-if="editingId !== trip.id">
                      <div class="time-col">{{ item.time }}</div>
                      <div class="event-col">
                        <div class="event-name">{{ item.name }}</div>
                        <div class="event-city">{{ item.city }}</div>
                      </div>
                      <div class="price-col">
                          <span class="price-tag-pill">{{ item.price }} €</span>
                      </div>
                    </template>

                    <template v-else>
                      <div class="edit-row">
                        <div class="edit-col small">
                          <label>Oră</label>
                          <input v-model="item.time" class="input-edit-sm" :class="{ 'error-input': errors[day]?.[idx]?.time }">
                        </div>
                        <div class="edit-col grow">
                          <label>Activitate</label>
                          <input v-model="item.name" class="input-edit" :class="{ 'error-input': errors[day]?.[idx]?.name }">
                        </div>
                        <div class="edit-col grow">
                            <label>Oraș</label>
                            <input v-model="item.city" class="input-edit">
                        </div>
                        <div class="edit-col small">
                          <label>Preț</label>
                          <input type="number" v-model="item.price" class="input-edit-sm" min="0" :class="{ 'error-input': errors[day]?.[idx]?.price }">
                        </div>
                        <button @click="removeActivity(day, idx)" class="btn-remove-item">&times;</button>
                      </div>
                    </template>
                  </div>
                </div>
                <div v-if="editingId === trip.id" class="add-activity-wrapper">
                  <button @click="addActivity(day)" class="btn-add-activity">Adaugă activitate</button>
                </div>
              </div>
            </div>
            <div v-if="editingId === trip.id">
              <button @click="addDay" class="btn-dashed mt-2">+ Adaugă Ziua Următoare</button>
            </div>
          </div>

          <div class="notes-wrapper">
            <div class="section-header-small">Notițe</div>
            <div class="aesthetic-notes-box">
               <textarea v-if="editingId === trip.id" v-model="editForm.notes" class="pdf-editable-textarea active-edit"></textarea>
               <div v-else class="pdf-readonly-text">{{ trip.notes || "Fără notițe." }}</div>
            </div>
          </div>

          <div class="doc-footer-styled">
            Generat de Wanderlust Planner
          </div>
        </div>

        <div class="actions-row">
          <div v-if="editingId === trip.id" class="edit-group">
            <span v-if="formStatus" class="status-msg">{{ formStatus }}</span>
            <button @click="saveTrip" class="btn-action save">Salvează</button>
            <button @click="cancelEdit" class="btn-action cancel">Anulează</button>
          </div>
          <div v-else class="view-group">
            <button @click="startEdit(trip)" class="btn-action edit">Editează</button>
            <button @click="deleteTrip(trip.id)" class="btn-action delete">Șterge</button>
            <button @click="exportToPDF(trip)" class="btn-pdf-gradient" :disabled="isGenerating">PDF</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

.error-input {
  border: 1px solid #e74c3c !important;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.2);
}

.error-hint {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
  font-style: italic;
}

.status-msg {
  color: #e74c3c;
  font-weight: 600;
  margin-right: 15px;
  font-size: 0.9rem;
}

.page-container { max-width: 850px; margin: 0 auto; padding: 40px 20px; font-family: 'Poppins', sans-serif; color: #333; background-color: #f4f7f9; }
.header-section { text-align: center; margin-bottom: 40px; }
.page-title { font-weight: 700; color: #2c3e50; font-size: 2.2rem; margin: 0; }
.subtitle { color: #607d8b; margin-top: 5px; }

.btn-create-main { background: #3498db; color: white; border: none; padding: 12px 30px; font-size: 1rem; font-weight: 600; border-radius: 50px; cursor: pointer; margin-top: 20px; transition: 0.3s; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3); }
.btn-create-main:hover { background: #2980b9; transform: translateY(-2px); }

.trip-wrapper { margin-bottom: 60px; }
.creating-mode { border: 2px dashed #3498db; padding: 20px; border-radius: 20px; background: #eaf6ff; }
.aesthetic-card { background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; position: relative; border: none; }

.ticket-header-gradient { background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 25px 40px; position: relative; }
.ticket-header-gradient.new-entry { background: linear-gradient(135deg, #27ae60, #2ecc71); }

.header-content-overlay { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; }
.logo-area { display: flex; align-items: center; gap: 10px; }
.brand-name { font-weight: 700; font-size: 1.2rem; letter-spacing: 1px; display: block; line-height: 1; }
.brand-sub { font-weight: 300; font-size: 0.75rem; opacity: 0.8; letter-spacing: 0.5px; display: block; }
.ticket-meta { text-align: right; }
.meta-label { display: block; font-size: 0.65rem; opacity: 0.7; letter-spacing: 1px; text-transform: uppercase; }
.meta-value { font-family: monospace; font-size: 1.1rem; font-weight: 600; letter-spacing: 1px; }

.trip-hero { padding: 30px 40px 20px; }
.destination-title { font-size: 3rem; margin: 0 0 10px 0; color: #2c3e50; text-transform: uppercase; letter-spacing: -1.5px; font-weight: 800; background: -webkit-linear-gradient(45deg, #2c3e50, #3498db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.trip-info-row { display: flex; gap: 12px; }
.info-badge { font-size: 0.85rem; padding: 6px 14px; border-radius: 20px; font-weight: 600; }
.blue-badge { background: #e3f2fd; color: #1565c0; }
.green-badge { background: #e8f5e9; color: #2e7d32; }

.edit-label { display: block; font-size: 0.8rem; color: #999; margin-bottom: 5px; }
.input-edit-lg { font-size: 2rem; font-weight: 700; color: #2c3e50; width: 100%; border: 1px dashed #3498db; padding: 5px; border-radius: 4px; }

.price-compact-section { margin: 0 40px 30px; padding: 15px 25px; background-color: #f8f9fa; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #edf2f7; }
.price-label-box { font-size: 0.75rem; font-weight: 700; color: #607d8b; text-transform: uppercase; display: flex; align-items: center; gap: 5px; }
.p-val { font-weight: 700; color: #455a64; font-size: 1.1rem; }
.highlight-blue { color: #00a8ff; } 
.price-row { display: flex; align-items: center; gap: 25px; }
.price-item { display: flex; flex-direction: column; align-items: flex-end; }
.p-type { font-size: 0.75rem; color: #90a4ae; margin-bottom: 2px; font-weight: 500; }

.itinerary-section { padding: 0 40px 20px; }
.day-container { margin-bottom: 25px; }
.day-header-styled { display: flex; align-items: center; margin-bottom: 15px; }
.day-number { font-size: 0.9rem; font-weight: 700; color: #00a8ff; margin-right: 15px; white-space: nowrap; }
.day-line { height: 2px; background: #e3f2fd; flex-grow: 1; }

.timeline-item { display: flex; align-items: center; padding: 10px; background: white; border-bottom: 1px solid #f0f0f0; }
.time-col { width: 60px; font-size: 0.9rem; color: #607d8b; font-weight: 600; }
.event-col { flex-grow: 1; padding-right: 15px; }
.event-name { font-weight: 600; font-size: 1rem; color: #2c3e50; }
.event-city { font-size: 0.85rem; color: #90a4ae; }
.price-col { min-width: 60px; text-align: right; }
.price-tag-pill { background: #e0f7fa; color: #0097a7; font-weight: 700; font-size: 0.85rem; padding: 4px 10px; border-radius: 12px; }

.edit-row { display: flex; gap: 10px; width: 100%; align-items: center; background: #f9fbfd; padding: 10px; border-radius: 8px; border: 1px dashed #cbd5e0; position: relative; }
.edit-col { display: flex; flex-direction: column; }
.edit-col label { font-size: 0.7rem; color: #999; margin-bottom: 2px; }
.edit-col.grow { flex: 1; }
.edit-col.small { width: 90px; }
.input-edit, .input-edit-sm { width: 100%; border: 1px solid #ddd; padding: 5px; border-radius: 4px; font-size: 0.9rem; }
.input-edit:focus, .input-edit-sm:focus { border-color: #3498db; outline: none; }

.btn-remove-item { background: #e74c3c; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-left: 5px; }
.add-activity-wrapper { text-align: center; margin-top: 10px; }
.btn-add-activity { background: transparent; border: 1px dashed #3498db; color: #3498db; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-dashed { width: 100%; border: 1px dashed #95a5a6; color: #7f8c8d; padding: 10px; cursor: pointer; background: transparent; }

.notes-wrapper { padding: 0 40px 40px; page-break-inside: avoid; }
.section-header-small { font-size: 0.75rem; font-weight: 700; color: #546e7a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
.aesthetic-notes-box { background: #fff; border: 2px solid #80deea; padding: 0; border-radius: 12px; overflow: hidden; background-color: #e0f7fa; }

.pdf-editable-textarea { width: 100%; min-height: 120px; border: none; padding: 15px; font-family: 'Poppins', sans-serif; font-size: 0.95rem; color: #2c3e50; line-height: 1.6; resize: vertical; outline: none; background: transparent; }
.pdf-readonly-text { padding: 15px; color: #2c3e50; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; }
.active-edit { background: white; }

.doc-footer-styled { text-align: center; padding: 20px; font-size: 0.75rem; color: #b0bec5; background: #fcfdfe; border-top: 1px solid #f0f0f0; }

.actions-row { margin-top: 20px; display: flex; justify-content: flex-end; align-items: center; gap: 10px; }
.edit-group, .view-group { display: flex; gap: 10px; align-items: center; }

.btn-action { padding: 10px 20px; border: none; border-radius: 50px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
.save { background: #27ae60; color: white; }
.cancel { background: #95a5a6; color: white; }
.edit { background: #3498db; color: white; }
.delete { background: #e74c3c; color: white; }
.btn-pdf-gradient { background: #2c3e50; color: white; border: none; padding: 10px 25px; border-radius: 50px; font-weight: 600; cursor: pointer; }

.empty-state { text-align: center; margin-top: 60px; color: #7f8c8d; }
.mt-2 { margin-top: 15px; }
</style>