import api from './api'

const storeSession = (data) => {
  if (data?.token) {
    localStorage.setItem('token', data.token)
  }
  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user))
  }
}

const authService = {
  register: async (payload) => {
    const { data } = await api.post('auth/register', payload)
    storeSession(data)
    return data
  },

  login: async (payload) => {
    const { data } = await api.post('auth/login', payload)
    storeSession(data)
    return data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getProfile: () => api.get('users/me'),
}

export default authService
