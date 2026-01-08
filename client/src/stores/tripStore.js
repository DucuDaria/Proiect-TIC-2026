import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTripStore = defineStore('trip', () => {
  const currentDay = ref(1)
  const currentTrip = ref({ 1: [] })
  const savedVacations = ref([])
  const stored = localStorage.getItem('my_vacations')
  if (stored) savedVacations.value = JSON.parse(stored)
  watch(savedVacations, (newVal) => {
    localStorage.setItem('my_vacations', JSON.stringify(newVal))
  }, { deep: true })

  const itemsInCurrentDay = computed(() => currentTrip.value[currentDay.value] || [])

  function checkConflict(time) {
    const dayList = currentTrip.value[currentDay.value] || []
    return dayList.find(item => item.time === time)
  }

  function addToItinerary(attraction, city, country, time) {
    if (!currentTrip.value[currentDay.value]) {
      currentTrip.value[currentDay.value] = []
    }
    const dayList = currentTrip.value[currentDay.value]

    dayList.push({
      id: Date.now(),
      name: attraction.name,
      price: attraction.price,
      city: city,
      country: country,
      time: time
    })
    
    dayList.sort((a, b) => a.time.localeCompare(b.time))
  }

  function nextDay() {
    currentDay.value++
    if (!currentTrip.value[currentDay.value]) {
      currentTrip.value[currentDay.value] = []
    }
  }

  function removeFromCurrentDay(index) {
    currentTrip.value[currentDay.value].splice(index, 1)
  }

  function saveTrip() {
    const allItems = Object.values(currentTrip.value).flat()
    
    if (allItems.length === 0) return 

    const grandTotal = allItems.reduce((sum, item) => sum + item.price, 0)
    const primaryCountry = allItems[0].country

    savedVacations.value.push({
      id: Date.now(),
      name: `Vacanța #${savedVacations.value.length + 1}`,
      country: primaryCountry,
      totalPrice: grandTotal,
      itinerary: JSON.parse(JSON.stringify(currentTrip.value)),
      totalDays: currentDay.value,
    
      notes: '',       
      guests: 1        
    })

    currentTrip.value = { 1: [] }
    currentDay.value = 1
  }

  return { 
    currentDay, currentTrip, itemsInCurrentDay, savedVacations, 
    checkConflict, addToItinerary, removeFromCurrentDay, nextDay, saveTrip 
  }
})