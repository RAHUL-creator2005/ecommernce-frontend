import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import categoryService from '../services/categoryService'
import productService from '../services/productService'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState('')
  const [products, setProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        setError('')
        const { data } = await categoryService.getCategories()
        if (active) {
          setCategories(data?.categories || [])
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Failed to load categories')
        }
      } finally {
        if (active) {
          setLoadingCategories(false)
        }
      }
    }

    loadCategories()

    return () => {
      active = false
    }
  }, [])

  const loadAllProducts = async () => {
    try {
      setLoadingProducts(true)
      setError('')
      const { data } = await productService.getProducts({ page: 1, limit: 12 })
      setProducts(data?.products || [])
      setSelected('')
    } catch (err) {
      setError(err?.message || 'Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  const loadProductsByCategory = async (categoryName) => {
    try {
      setLoadingProducts(true)
      setError('')
      const { data } = await categoryService.getProductsByCategory(categoryName)
      setProducts(data?.products || [])
      setSelected(categoryName)
    } catch (err) {
      setError(err?.message || 'Failed to load products')
    } finally {
      setLoadingProducts(false)
    }
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Shop by category
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Pick a category to explore products.
          </Typography>
        </Stack>

        {loadingCategories ? (
          <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
            <Button variant={selected ? 'outlined' : 'contained'} size="small" onClick={loadAllProducts}>
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selected === category ? 'contained' : 'outlined'}
                size="small"
                onClick={() => loadProductsByCategory(category)}
              >
                {category}
              </Button>
            ))}
          </Stack>
        )}

        {loadingProducts ? (
          <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Alert severity="info">Select a category to see products.</Alert>
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
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default CategoriesPage
