<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const activeTab = ref('destinations');
const showModal = ref(false);
const isEditing = ref(false);

const users = ref([]);
const destinations = ref([]);
const userBookings = ref([]);
const selectedUser = ref('');

const form = ref({
  id: null,
  isPublic: true,
  country: '',
  description: '',
  image: '',
  cities: []
});

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authStore.token}`
});

const loadData = async () => {
  const [usersRes, destRes] = await Promise.all([
    fetch('http://localhost:3000/api/admin/users', { headers: getHeaders() }),
    fetch('http://localhost:3000/api/destinations')
  ]);
  
  const usersData = await usersRes.json();
  const destData = await destRes.json();
  
  users.value = usersData.data;
  destinations.value = destData.data.destinations;
};

const openUserHistory = async (user) => {
  selectedUser.value = user.email;
  const res = await fetch(`http://localhost:3000/api/admin/users/${user.uid}/bookings`, { headers: getHeaders() });
  const data = await res.json();
  userBookings.value = data.data;
  showModal.value = true;
};

const resetForm = () => {
  isEditing.value = false;
  form.value = { id: null, isPublic: true, country: '', description: '', image: '', cities: [] };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const editDestination = (dest) => {
  isEditing.value = true;
  form.value = JSON.parse(JSON.stringify(dest));
  if (!form.value.cities) form.value.cities = [];
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const deleteDestination = async (id) => {
  if (!confirm('Ștergi această destinație?')) return;
  await fetch(`http://localhost:3000/api/destinations/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  loadData();
};

const isValidUrl = (str) => {
  try { return Boolean(new URL(str)); } catch(e){ return false; }
}

const validateAdminForm = () => {
  if (!form.value.country || form.value.country.trim().length < 3) {
    alert("Numele țării este prea scurt.");
    return false;
  }
  if (form.value.image && !isValidUrl(form.value.image)) {
    alert("URL-ul imaginii de copertă este invalid.");
    return false;
  }
  if (!form.value.description || form.value.description.trim().length < 10) {
    alert("Descrierea trebuie să aibă minim 10 caractere.");
    return false;
  }

  for(let i=0; i<form.value.cities.length; i++) {
    const city = form.value.cities[i];
    if(!city.name) { alert(`Orașul #${i+1} nu are nume.`); return false; }
    if(city.image && !isValidUrl(city.image)) { alert(`URL-ul imaginii pentru ${city.name} este invalid.`); return false; }
    
    for(let j=0; j<city.attractions.length; j++) {
      const attr = city.attractions[j];
      if(!attr.name) { alert(`Atracția #${j+1} din ${city.name} nu are nume.`); return false; }
      if(attr.price < 0) { alert(`Prețul pentru ${attr.name} nu poate fi negativ.`); return false; }
    }
  }

  return true;
}

const submitForm = async () => {
  if (!validateAdminForm()) return;

  const url = isEditing.value 
    ? `http://localhost:3000/api/destinations/${form.value.id}`
    : 'http://localhost:3000/api/destinations';
    
  const method = isEditing.value ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: getHeaders(),
      body: JSON.stringify(form.value)
    });

    const data = await res.json();
    if(!res.ok) {
        if(data.errors) alert(data.errors.join('\n'));
        else alert(data.message);
        return;
    }

    resetForm();
    loadData();
  } catch (e) {
    alert(e.message);
  }
};

const addCity = () => form.value.cities.push({ name: '', image: '', attractions: [] });
const removeCity = (index) => form.value.cities.splice(index, 1);
const addAttraction = (cityIndex) => form.value.cities[cityIndex].attractions.push({ name: '', type: '', price: 0 });
const removeAttraction = (cityIndex, attrIndex) => form.value.cities[cityIndex].attractions.splice(attrIndex, 1);

onMounted(loadData);
</script>

<template>
  <div class="page-container">
    <header class="admin-header">
      <div class="header-content">
        <h1>Admin Panel</h1>
        <span class="user-badge">{{ authStore.user?.email }}</span>
      </div>
      <div class="tabs">
        <button :class="{ active: activeTab === 'destinations' }" @click="activeTab = 'destinations'">Gestiune Destinații</button>
        <button :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Gestiune Utilizatori</button>
      </div>
    </header>

    <main class="main-content">
      <div v-if="activeTab === 'destinations'">
        <div class="card editor">
          <div class="card-head">
            <h3>{{ isEditing ? 'Editare' : 'Adăugare' }}</h3>
            <button v-if="isEditing" @click="resetForm" class="btn-text">Anulează</button>
          </div>
          
          <div class="form-grid">
            <input v-model="form.country" placeholder="Nume Țară" class="input">
            <input v-model="form.image" placeholder="URL Imagine Copertă" class="input">
          </div>
          <textarea v-model="form.description" placeholder="Descriere..." class="input area"></textarea>

          <div class="cities-section">
            <div v-for="(city, i) in form.cities" :key="i" class="city-row">
              <div class="city-inputs">
                <input v-model="city.name" placeholder="Oraș" class="input sm">
                <input v-model="city.image" placeholder="URL Poză" class="input sm">
                <button @click="removeCity(i)" class="btn-del">×</button>
              </div>
              <div class="attrs">
                <div v-for="(attr, j) in city.attractions" :key="j" class="attr-item">
                  <input v-model="attr.name" placeholder="Obiectiv" class="input xs">
                  <input v-model="attr.type" placeholder="Tip" class="input xs">
                  <input v-model="attr.price" type="number" placeholder="€" class="input xs price" min="0">
                  <button @click="removeAttraction(i, j)" class="btn-del small">×</button>
                </div>
                <button @click="addAttraction(i)" class="btn-link">+ Atracție</button>
              </div>
            </div>
            <button @click="addCity" class="btn-dashed">Adaugă Oraș</button>
          </div>

          <button @click="submitForm" class="btn-primary full">{{ isEditing ? 'Salvează' : 'Publică' }}</button>
        </div>

        <div class="dest-grid">
          <div v-for="item in destinations" :key="item.id" class="dest-card">
            <div class="thumb" :style="{ backgroundImage: `url(${item.image})` }"></div>
            <div class="info">
              <h4>{{ item.country }}</h4>
              <div class="actions">
                <button @click="editDestination(item)" class="btn-act edit">Edit</button>
                <button @click="deleteDestination(item.id)" class="btn-act del">Șterge</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'users'">
        <div class="card">
          <table class="simple-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Dată Înregistrare</th>
                <th align="right">Istoric</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in users" :key="u.uid">
                <td>{{ u.email }}</td>
                <td>{{ new Date(u.creationTime).toLocaleDateString() }}</td>
                <td align="right"><button @click="openUserHistory(u)" class="btn-small">Vezi</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-bg" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-top">
          <h3>{{ selectedUser }}</h3>
          <button @click="showModal = false" class="btn-close">×</button>
        </div>
        <div class="modal-content">
          <div v-if="!userBookings.length" class="empty">Nu are vacanțe.</div>
          <div v-else class="bookings-list">
            <div v-for="b in userBookings" :key="b.id" class="bk-item">
              <div>
                <strong>{{ b.country }}</strong>
                <span class="sub">{{ b.totalDays }} zile</span>
              </div>
              <div class="price">{{ b.totalPrice }} €</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container { max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Segoe UI', sans-serif; color: #2c3e50; }
.admin-header { margin-bottom: 30px; text-align: center; }
.header-content h1 { margin: 0; font-size: 1.8rem; }
.user-badge { background: #e3f2fd; color: #3498db; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; }
.tabs { display: flex; justify-content: center; gap: 20px; margin-top: 20px; border-bottom: 1px solid #eee; }
.tabs button { background: none; border: none; padding: 10px 20px; font-size: 1rem; cursor: pointer; color: #95a5a6; border-bottom: 2px solid transparent; }
.tabs button.active { color: #3498db; border-bottom-color: #3498db; font-weight: 600; }

.card { background: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 30px; }
.card-head { display: flex; justify-content: space-between; margin-bottom: 15px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
.area { height: 80px; resize: vertical; margin-bottom: 15px; }

.cities-section { background: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 15px; }
.city-row { background: white; padding: 10px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 10px; }
.city-inputs { display: flex; gap: 10px; margin-bottom: 5px; }
.attrs { padding-left: 10px; border-left: 2px solid #3498db; }
.attr-item { display: flex; gap: 5px; margin-top: 5px; }
.input.sm { flex: 1; }
.input.xs { flex: 1; padding: 5px; font-size: 0.9rem; }
.price { width: 70px; }

.btn-primary { background: #3498db; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; width: 100%; }
.btn-dashed { width: 100%; border: 1px dashed #ccc; background: none; padding: 8px; cursor: pointer; margin-top: 5px; color: #666; }
.btn-del { background: #ff7675; color: white; border: none; width: 30px; cursor: pointer; border-radius: 4px; }
.btn-link { background: none; border: none; color: #3498db; cursor: pointer; font-size: 0.85rem; }
.btn-text { background: none; border: none; color: #999; cursor: pointer; }

.dest-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
.dest-card { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #eee; }
.thumb { height: 120px; background-size: cover; background-position: center; }
.info { padding: 10px; }
.info h4 { margin: 0 0 5px; }
.actions { display: flex; gap: 5px; }
.btn-act { flex: 1; border: none; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
.edit { background: #e3f2fd; color: #3498db; }
.del { background: #ffebee; color: #c0392b; }

.simple-table { width: 100%; border-collapse: collapse; }
.simple-table th { text-align: left; padding: 10px; color: #999; border-bottom: 1px solid #eee; }
.simple-table td { padding: 10px; border-bottom: 1px solid #f9f9f9; }
.btn-small { background: #3498db; color: white; border: none; padding: 4px 10px; border-radius: 12px; cursor: pointer; font-size: 0.8rem; }

.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
.modal { background: white; width: 400px; border-radius: 8px; overflow: hidden; }
.modal-top { padding: 15px; background: #f9f9f9; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; }
.modal-content { padding: 20px; max-height: 70vh; overflow-y: auto; }
.bk-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee; }
.sub { display: block; font-size: 0.8rem; color: #999; }
.price { font-weight: bold; color: #27ae60; }
.btn-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #999; }
</style>