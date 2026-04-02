import api from './api'

const productService = {
  getProducts: (params) => api.get('products', params ? { params } : undefined),
  getProductById: (id) => api.get(`products/${id}`),
  createProduct: (payload) => api.post('products', payload),
  updateProduct: (id, payload) => api.put(`products/${id}`, payload),
  deleteProduct: (id) => api.delete(`products/${id}`),
}

export default productService
