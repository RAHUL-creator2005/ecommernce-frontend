import api from './api'

const userService = {
  getUsers: () => api.get('users'),
  getUserById: (id) => api.get(`users/${id}`),
  updateUserRole: (id, payload) => api.put(`users/${id}/role`, payload),
  deleteUser: (id) => api.delete(`users/${id}`),
}

export default userService
