import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {
  FacebookOutlined,
  Instagram,
  LocalShippingOutlined,
  SecurityOutlined,
  SupportAgentOutlined,
} from '@mui/icons-material'

function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 6, borderTop: '1px solid #1f2937', bgcolor: '#0b1220', color: '#e2e8f0' }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#e2e8f0' }}>
            ShopWave
          </Typography>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" aria-label="facebook" color="inherit">
              <FacebookOutlined fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="instagram" color="inherit">
              <Instagram fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalShippingOutlined fontSize="small" />
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
              Fast delivery
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <SupportAgentOutlined fontSize="small" />
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
              24/7 support
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <SecurityOutlined fontSize="small" />
            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
              Secure payment
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/" underline="hover" color="#e2e8f0">
            Home
          </Link>
          <Link component={RouterLink} to="/products/1" underline="hover" color="#e2e8f0">
            Products
          </Link>
          <Link component={RouterLink} to="/cart" underline="hover" color="#e2e8f0">
            Cart
          </Link>
          <Link component={RouterLink} to="/login" underline="hover" color="#e2e8f0">
            Login
          </Link>
        </Stack>

        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
          (c) {new Date().getFullYear()} ShopWave. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
