import api from './api'

const orderService = {
  createOrder: (payload) => api.post('/orders', payload),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  updateOrderStatus: (id, payload) => api.put(`/orders/${id}/status`, payload),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
}

export default orderService
