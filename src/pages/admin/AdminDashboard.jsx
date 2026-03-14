import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminSidebar from '../../components/AdminSidebar'
import productService from '../../services/productService'

function AdminDashboard() {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [labels, setLabels] = useState([])
  const [values, setValues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await productService.getProducts({ page: 1, limit: 1000 })
        const products = data?.products || []
        const counts = {}

        products.forEach((product) => {
          const key = product?.category || 'Uncategorized'
          counts[key] = (counts[key] || 0) + 1
        })

        const nextLabels = Object.keys(counts)
        const nextValues = nextLabels.map((label) => counts[label])

        if (active) {
          setLabels(nextLabels)
          setValues(nextValues)
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
  }, [])

  useEffect(() => {
    if (!canvasRef.current || labels.length === 0) {
      return
    }

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Products',
            data: values,
            backgroundColor: '#f0c14b',
            borderColor: '#d6a539',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [labels, values])

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Admin Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Product count by category
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : labels.length === 0 ? (
              <Alert severity="info">No products found to chart.</Alert>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, borderColor: '#e3e6e6' }}>
                <Box sx={{ height: 360 }}>
                  <canvas ref={canvasRef} />
                </Box>
              </Paper>
            )}
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  )
}

export default AdminDashboard
