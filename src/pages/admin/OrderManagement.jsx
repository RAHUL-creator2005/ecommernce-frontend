import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Delete } from '@mui/icons-material'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AdminSidebar from '../../components/AdminSidebar'
import orderService from '../../services/orderService'

const statusOptions = ['pending', 'shipped', 'delivered']

function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await orderService.getAllOrders()
      setOrders(data?.orders || [])
    } catch (err) {
      setError(err?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      setUpdatingId(orderId)
      await orderService.updateOrderStatus(orderId, { status: nextStatus })
      setToast({ open: true, message: 'Status updated', severity: 'success' })
      await loadOrders()
    } catch (err) {
      setToast({ open: true, message: err?.message || 'Failed to update status', severity: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (order) => {
    if (!order?._id) return
    const ok = window.confirm(`Delete order ${order._id}?`)
    if (!ok) return

    try {
      setDeletingId(order._id)
      await orderService.deleteOrder(order._id)
      setToast({ open: true, message: 'Order deleted', severity: 'success' })
      await loadOrders()
    } catch (err) {
      setToast({ open: true, message: err?.message || 'Delete failed', severity: 'error' })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flex: 1 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Order Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Review and update customer orders.
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : orders.length === 0 ? (
              <Alert severity="info">No orders found.</Alert>
            ) : (
              <Paper variant="outlined" sx={{ borderColor: '#e3e6e6' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>{order._id}</TableCell>
                        <TableCell>
                          {order.userId?.name || order.userId?.email || 'Unknown'}
                        </TableCell>
                        <TableCell align="right">
                          Rs {order.totalAmount?.toFixed?.(2) ?? order.totalAmount}
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={order.status}
                            onChange={(event) => handleStatusChange(order._id, event.target.value)}
                            disabled={updatingId === order._id}
                          >
                            {statusOptions.map((status) => (
                              <MenuItem key={status} value={status}>
                                {status}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(order)}
                            disabled={deletingId === order._id}
                            aria-label="Delete order"
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

export default OrderManagement
