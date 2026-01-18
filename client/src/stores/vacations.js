import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useVacationStore = defineStore('vacations', {
  state: () => ({
    vacations: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchVacations() {
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();
      
      try {
        const res = await fetch('http://localhost:3000/api/destinations/my-vacations', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token}` 
          }
        });
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.message);
        
        this.vacations = data.data.reverse();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.isLoading = false;
      }
    },

    async addVacation(vacationData) {
      const authStore = useAuthStore();
      const res = await fetch('http://localhost:3000/api/destinations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(vacationData)
      });
      const data = await res.json();
      
      if(!res.ok) {
        if(data.errors) throw new Error(data.errors.join('\n'));
        throw new Error(data.message);
      }
      
      this.vacations.unshift(data.data); 
    },

    async updateVacation(id, updatedData) {
      const authStore = useAuthStore();
      const res = await fetch(`http://localhost:3000/api/destinations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`
        },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();

      if(!res.ok) {
        if(data.errors) throw new Error(data.errors.join('\n'));
        throw new Error(data.message);
      }

      const index = this.vacations.findIndex(v => v.id === id);
      if (index !== -1) {
        this.vacations[index] = { ...updatedData, id }; 
      }
    },

    async deleteVacation(id) {
      const authStore = useAuthStore();
      const res = await fetch(`http://localhost:3000/api/destinations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      });
      
      if(!res.ok) throw new Error("Eroare la ștergerea vacanței.");

      this.vacations = this.vacations.filter(v => v.id !== id);
    }
  }
});