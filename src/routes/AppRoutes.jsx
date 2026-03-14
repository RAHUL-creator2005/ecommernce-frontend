import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoute from '../components/AdminRoute'
import ProtectedRoute from '../components/ProtectedRoute'
import CartPage from '../pages/CartPage'
import CategoriesPage from '../pages/CategoriesPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProductDetailsPage from '../pages/ProductDetailsPage'
import SignupPage from '../pages/SignupPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import OrderManagement from '../pages/admin/OrderManagement'
import ProductManagement from '../pages/admin/ProductManagement'
import UserManagement from '../pages/admin/UserManagement'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <ProductManagement />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <OrderManagement />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
