import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Header from '../components/Header'
import Footer from '../components/Footer'
import productService from '../services/productService'

const FALLBACK_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc2MDAnIGhlaWdodD0nNDAwJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZjNmNGY2Jy8+PHRleHQgeD0nNTAlJyB5PSc1MCUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGZpbGw9JyM2YjcyODAnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPScyNCc+Tm8gaW1hZ2U8L3RleHQ+PC9zdmc+'

function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await productService.getProductById(id)
        if (active) {
          setProduct(data?.product || null)
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Failed to load product')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    if (id) {
      loadProduct()
    } else {
      setLoading(false)
      setError('Invalid product id')
    }

    return () => {
      active = false
    }
  }, [id])

  const title = product?.title || product?.name
  const price = typeof product?.price === 'number' ? product.price.toFixed(2) : product?.price

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </Button>

        {loading ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !product ? (
          <Alert severity="info">Product not found.</Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
              gap: { xs: 3, md: 5 },
            }}
          >
            <Box
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 2,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 360,
              }}
            >
              <Box
                component="img"
                src={product.image || FALLBACK_IMAGE}
                alt={title}
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = FALLBACK_IMAGE
                }}
                sx={{ maxWidth: '100%', maxHeight: 420, objectFit: 'contain' }}
              />
            </Box>

            <Stack spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                {title}
              </Typography>

              {product.category ? (
                <Chip label={product.category} sx={{ width: 'fit-content' }} />
              ) : null}

              <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
                {price ? `Rs ${price}` : 'Price unavailable'}
              </Typography>

              <Typography variant="body2" sx={{ color: product.stock > 0 ? '#059669' : '#dc2626' }}>
                {product.stock > 0 ? 'In stock' : 'Out of stock'}
              </Typography>

              <Divider />

              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ color: '#4b5563' }}>
                {product.description}
              </Typography>

              <Divider />

              <Button
                variant="contained"
                size="large"
                sx={{ bgcolor: '#f0c14b', color: '#111827', '&:hover': { bgcolor: '#e2b33f' } }}
              >
                Add to Cart
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default ProductDetailsPage
