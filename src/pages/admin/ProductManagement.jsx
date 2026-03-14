import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Add, Delete, Edit } from '@mui/icons-material'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminSidebar from '../../components/AdminSidebar'
import productService from '../../services/productService'

const emptyForm = {
  title: '',
  price: '',
  category: '',
  stock: '',
  image: '',
  description: '',
}

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await productService.getProducts({ page: 1, limit: 100 })
      setProducts(data?.products || [])
    } catch (err) {
      setError(err?.message || 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const isCreate = useMemo(() => !editingProduct, [editingProduct])

  const openCreate = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      title: product.title || product.name || '',
      price: product.price ?? '',
      category: product.category?.name || product.category || '',
      stock: product.stock ?? product.countInStock ?? product.quantity ?? '',
      image: product.image || '',
      description: product.description || '',
    })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    if (saving) return
    setDialogOpen(false)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')
      const payload = {
        title: form.title.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        image: form.image.trim(),
        description: form.description.trim(),
      }

      if (isCreate) {
        await productService.createProduct(payload)
        setToast({ open: true, message: 'Product created', severity: 'success' })
      } else if (editingProduct?._id) {
        await productService.updateProduct(editingProduct._id, payload)
        setToast({ open: true, message: 'Product updated', severity: 'success' })
      }

      setDialogOpen(false)
      await loadProducts()
    } catch (err) {
      setToast({ open: true, message: err?.message || 'Action failed', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product) => {
    if (!product?._id) return
    const ok = window.confirm(`Delete product ${product.title || product.name || ''}?`)
    if (!ok) return

    try {
      setDeletingId(product._id)
      await productService.deleteProduct(product._id)
      setToast({ open: true, message: 'Product deleted', severity: 'success' })
      await loadProducts()
    } catch (err) {
      setToast({ open: true, message: err?.message || 'Delete failed', severity: 'error' })
    } finally {
      setDeletingId(null)
    }
  }

  const canSave = form.title.trim() && form.price !== '' && form.category.trim()

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Product Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Review and manage products.
              </Typography>
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
                Add Product
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : products.length === 0 ? (
              <Alert severity="info">No products found.</Alert>
            ) : (
              <Paper variant="outlined" sx={{ borderColor: '#e3e6e6' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>{product._id}</TableCell>
                        <TableCell>{product.title || product.name}</TableCell>
                        <TableCell>{product.category?.name || product.category || 'Uncategorized'}</TableCell>
                        <TableCell align="right">
                          Rs {product.price?.toFixed?.(2) ?? product.price}
                        </TableCell>
                        <TableCell align="right">
                          {product.stock ?? product.countInStock ?? product.quantity ?? '-'}
                        </TableCell>
                        <TableCell>
                          {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => openEdit(product)}
                            aria-label="Edit product"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                            aria-label="Delete product"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </Container>
        </Box>
      </Box>

      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isCreate ? 'Add Product' : 'Edit Product'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Category"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Image URL"
              value={form.image}
              onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
              fullWidth
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              multiline
              minRows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!canSave || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={1800}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  )
}

export default ProductManagement
