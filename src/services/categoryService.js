import api from './api'

const categoryService = {
  getCategories: () => api.get('/categories'),
  getProductsByCategory: (name) =>
    api.get(`/categories/${encodeURIComponent(name)}/products`),
  renameCategory: (name, payload) =>
    api.put(`/categories/${encodeURIComponent(name)}`, payload),
  deleteCategory: (name) => api.delete(`/categories/${encodeURIComponent(name)}`),
}

export default categoryService
