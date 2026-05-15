import { create } from 'zustand'
import client from '../api/client'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (username, password) => {
    const { data } = await client.post('/auth/login/', { username, password })
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    const me = await client.get('/auth/me/')
    set({ user: me.data, isAuthenticated: true })
  },

  register: async (userData) => {
    await client.post('/auth/register/', userData)
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({ user: null, isAuthenticated: false })
  },

  fetchMe: async () => {
    try {
      const { data } = await client.get('/auth/me/')
      set({ user: data, isAuthenticated: true })
    } catch {
      set({ user: null, isAuthenticated: false })
    }
  },
}))

export default useAuthStore
