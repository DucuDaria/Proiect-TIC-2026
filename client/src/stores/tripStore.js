import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTripStore = defineStore('trip', () => {
  const itinerary = ref([])
  
  function addDestination(dest) {
    itinerary.value.push(dest)
  }

  return { itinerary, addDestination }
})