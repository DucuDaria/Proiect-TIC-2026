import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth' 
import { auth } from '../firebaseConfig' 

export const useTripStore = defineStore('trip', () => {
  const currentDay = ref(1)
  const currentTrip = ref({ 1: [] }) 
  const isLoading = ref(false)
  const itemsInCurrentDay = computed(() => currentTrip.value[currentDay.value] || [])
  const items = computed(() => Object.values(currentTrip.value).flat())
  
  const totalPrice = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price, 0)
  })

  function addToItinerary(attraction, city, country, time) {
    if (!currentTrip.value[currentDay.value]) {
      currentTrip.value[currentDay.value] = []
    }
    const dayList = currentTrip.value[currentDay.value]
    
    if (dayList.find(i => i.time === time)) {
        return { success: false, message: `Ora ${time} este deja ocupată!` };
    }

    dayList.push({
      id: Date.now(),
      name: attraction.name,
      price: attraction.price,
      city: city,
      country: country,
      time: time,
      day: currentDay.value 
    })
    
    dayList.sort((a, b) => a.time.localeCompare(b.time))
    return { success: true }
  }

  function nextDay() {
    currentDay.value++
    if (!currentTrip.value[currentDay.value]) {
      currentTrip.value[currentDay.value] = []
    }
  }

  function removeFromCurrentDay(index) {
    const day = currentDay.value
    if (currentTrip.value[day]) {
      currentTrip.value[day].splice(index, 1)
    }
  }

  function removeFromItinerary(indexInFlatList) {
    const itemToRemove = items.value[indexInFlatList];
    if(!itemToRemove) return;

    for (const [day, list] of Object.entries(currentTrip.value)) {
        const idx = list.findIndex(i => i.id === itemToRemove.id);
        if (idx !== -1) {
            list.splice(idx, 1);
            break;
        }
    }
  }

  function checkConflict(time) {
      const dayList = currentTrip.value[currentDay.value] || []
      return dayList.find(item => item.time === time)
  }

  async function saveTrip() { 
    const authStore = useAuthStore()
    const allItems = items.value
    
    if (allItems.length === 0) {
        return { success: false, message: "Itinerariul este gol." };
    }

    isLoading.value = true

    try {
      let token = authStore.token;
      if (!token && auth.currentUser) {
          token = await auth.currentUser.getIdToken(true);
      } else if (!token) {
          return { success: false, message: "Nu ești autentificat." };
      }

      const payload = {
        country: allItems[0].country || "Circuit", 
        totalPrice: totalPrice.value,
        totalDays: currentDay.value,
        itinerary: currentTrip.value, 
        notes: ""
      };

      const response = await fetch('http://localhost:3000/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Eroare server");

      currentTrip.value = { 1: [] };
      currentDay.value = 1;
 
      return { success: true };

    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    } finally {
      isLoading.value = false;
    }
  }

  return { 
    currentDay, currentTrip, itemsInCurrentDay, items, totalPrice, isLoading,
    addToItinerary, removeFromCurrentDay, removeFromItinerary, nextDay, checkConflict, saveTrip 
  }
})