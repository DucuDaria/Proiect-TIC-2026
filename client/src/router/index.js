import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import DestinationDetailsView from '../views/DestinationDetailsView.vue'
import ItineraryView from '../views/ItineraryView.vue'
import LoginView from '../views/LoginView.vue' 
import MyVacationsView from '../views/MyVacationsView.vue'
import InspireView from '../views/InspireView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/login',    
      name: 'login',
      component: LoginView
    },
    {
      path: '/destination/:id',
      name: 'details',
      component: DestinationDetailsView
    },
    {
      path: '/itinerary',
      name: 'itinerary',
      component: ItineraryView
    },
    {
  path: '/my-vacations',
  name: 'my-vacations',
  component: MyVacationsView
},
{
  path: '/inspire',
  name: 'inspire',
  component: InspireView
},
  ]
})

export default router