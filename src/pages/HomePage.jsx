import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import productService from '../services/productService'
import { useCart } from '../context/CartContext'

function HomePage() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  })
  const [page, setPage] = useState(1)
  const limit = 9
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('Added to cart')

  const visibleProducts = products.filter((product) => {
    if (!searchQuery) {
      return true
    }
    const q = searchQuery.toLowerCase()
    const title = product?.title || product?.name || ''
    return title.toLowerCase().includes(q)
  })

  useEffect(() => {
    let active = true

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await productService.getProducts({ page, limit })
        if (active) {
          setProducts(data?.products || [])
          setPagination({
            page: data?.pagination?.page || page,
            totalPages: data?.pagination?.totalPages || 1,
            hasNextPage: Boolean(data?.pagination?.hasNextPage),
            hasPrevPage: Boolean(data?.pagination?.hasPrevPage),
          })
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Failed to load products')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      active = false
    }
  }, [page])

  return (
    <>
      <Header showSearch searchValue={searchQuery} onSearchChange={setSearchQuery} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Discover fresh deals
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Shop the latest products with fast delivery and secure checkout.
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : visibleProducts.length === 0 ? (
          <Alert severity="info">No products found.</Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
            }}
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onView={() => navigate(`/products/${product._id}`)}
                onAddToCart={() => {
                  addItem(product, 1)
                  setToastMessage('Added to cart')
                  setToastOpen(true)
                }}
              />
            ))}
          </Box>
        )}

        {!loading && !error && pagination.totalPages > 1 && !searchQuery ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 4 }}
          >
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Page {pagination.page} of {pagination.totalPages}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="small"
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </Stack>
          </Stack>
        ) : null}
      </Container>
      <Snackbar
        open={toastOpen}
        autoHideDuration={1500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setToastOpen(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </>
  )
}

export default HomePage
