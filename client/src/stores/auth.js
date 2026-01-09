import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { auth } from '../firebaseConfig'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const authIsReady = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  function initAuth() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          token.value = await firebaseUser.getIdToken() 
        } else {
          user.value = null
          token.value = null
        }
        authIsReady.value = true
        resolve()
      })
    })
  }

  async function register(email, password) {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    if (!res) throw new Error('Nu s-a putut finaliza înregistrarea')
    user.value = res.user
  }

  async function login(email, password) {
    const res = await signInWithEmailAndPassword(auth, email, password)
    if (!res) throw new Error('Nu s-a putut efectua logarea')
    user.value = res.user
  }

  async function logout() {
    await signOut(auth)
    user.value = null
    token.value = null
  }

  return { 
    user, token, authIsReady, isAuthenticated, 
    initAuth, register, login, logout 
  }
})