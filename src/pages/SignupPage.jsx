import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ name, email, password })
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: '#f0c14b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonAddAltIcon sx={{ color: '#111827' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              Create account
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Sign up to start shopping.
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Stack spacing={2}>
              {error ? <Alert severity="error">{error}</Alert> : null}

              <TextField
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlineIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ bgcolor: '#f0c14b', color: '#111827', '&:hover': { bgcolor: '#e2b33f' } }}
              >
                {loading ? <CircularProgress size={22} /> : 'Sign up'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </>
  )
}

export default SignupPage
