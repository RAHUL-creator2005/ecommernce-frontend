import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { items, updateQty, removeItem } = useCart()
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 3 }}>
          Your Cart
        </Typography>

        {items.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 3, borderColor: '#e3e6e6' }}>
            <Typography>Your cart is empty.</Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
              gap: 3,
            }}
          >
            <Stack spacing={2}>
              {items.map((item) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2, borderColor: '#e3e6e6' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '90px 1fr', sm: '120px 1fr auto' }, gap: 2 }}>
                    <Box
                      component="img"
                      src={item.image}
                      alt={item.title}
                      sx={{ width: '100%', height: 90, objectFit: 'contain' }}
                    />
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Rs {item.price.toFixed(2)}
                      </Typography>
                      <TextField
                        label="Qty"
                        type="number"
                        size="small"
                        value={item.qty}
                        onChange={(event) => updateQty(item.id, event.target.value)}
                        inputProps={{ min: 1 }}
                        sx={{ width: 100 }}
                      />
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                      <IconButton aria-label="remove" onClick={() => removeItem(item.id)}>
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </Stack>

            <Paper variant="outlined" sx={{ p: 3, borderColor: '#e3e6e6', height: 'fit-content' }}>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Order Summary
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">Rs {subtotal.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">Free</Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Rs {subtotal.toFixed(2)}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ bgcolor: '#f0c14b', color: '#111827', '&:hover': { bgcolor: '#e2b33f' } }}
                >
                  Checkout
                </Button>
              </Stack>
            </Paper>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export default CartPage
