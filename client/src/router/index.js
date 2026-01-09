import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import DashboardView from '../views/DashboardView.vue'
import DestinationDetailsView from '../views/DestinationDetailsView.vue'
import ItineraryView from '../views/ItineraryView.vue'
import LoginView from '../views/LoginView.vue' 
import MyVacationsView from '../views/MyVacationsView.vue'
import InspireView from '../views/InspireView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',    
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/',
      name: 'home',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/destination/:id',
      name: 'details',
      component: DestinationDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/itinerary',
      name: 'itinerary',
      component: ItineraryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/my-vacations',
      name: 'my-vacations',
      component: MyVacationsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/inspire',
      name: 'inspire',
      component: InspireView,
      meta: { requiresAuth: true }
    }
  ]
})
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.authIsReady) {
    await authStore.initAuth();
  }

  const isPublic = to.name === 'login' || to.name === 'register';
  const isLoggedIn = authStore.isAuthenticated;
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } 
  else if (isLoggedIn && isPublic) {
    next('/');
  } 
  else {
    next();
  }
});

export default router