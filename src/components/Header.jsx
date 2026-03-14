import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {
  FavoriteBorder,
  Menu,
  Logout,
  PersonOutline,
  Search,
  ShoppingCartOutlined,
  Storefront,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const baseLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/cart', label: 'Cart' },
]

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#f8fafc' : '#94a3b8',
  fontWeight: isActive ? 700 : 500,
  textDecoration: 'none',
  padding: '6px 10px',
  borderRadius: 6,
})

function Header({ showSearch = false, searchValue = '', onSearchChange }) {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef(null)
  const isLoggedIn = isAuthenticated
  const displayName = user?.name || user?.email || 'User'
  const isAdmin = user?.role === 'admin'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: '#0b1220', color: '#e2e8f0', borderBottom: '1px solid #1f2937' }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            px: { xs: 1.5, sm: 2 },
            gap: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Storefront />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.4, fontSize: { xs: 20, md: 22 } }}>
              ShopWave
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {[...baseLinks, ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : [])].map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} style={navLinkStyle}>
                {link.label}
              </NavLink>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              aria-label="open menu"
              color="inherit"
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <Menu fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="toggle search"
              color="inherit"
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              <Search fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label="wishlist" color="inherit">
              <FavoriteBorder fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              aria-label="cart"
              color="inherit"
              component={RouterLink}
              to="/cart"
            >
              <ShoppingCartOutlined fontSize="small" />
            </IconButton>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 1.5, gap: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: '#f0c14b',
                    color: '#111827',
                    fontSize: 13,
                  }}
                  title={displayName}
                >
                  {initials || 'U'}
                </Avatar>
                <Button
                  size="small"
                  variant="text"
                  onClick={handleLogout}
                  sx={{ color: '#e2e8f0', textTransform: 'none' }}
                  startIcon={<Logout fontSize="small" />}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 1.5 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    size="small"
                    variant="text"
                    sx={{
                      color: '#60a5fa',
                      textTransform: 'none',
                      '&:hover': { color: '#93c5fd' },
                    }}
                  >
                    Login
                  </Button>
                  <Typography sx={{ px: 0.5, color: '#94a3b8' }}>/</Typography>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    size="small"
                    variant="contained"
                    sx={{ bgcolor: '#f0c14b', color: '#111827', textTransform: 'none' }}
                  >
                    Signup
                  </Button>
                </Box>
                <IconButton
                  size="small"
                  aria-label="account"
                  color="inherit"
                  sx={{ display: { xs: 'inline-flex', md: 'none' } }}
                >
                  <PersonOutline fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
        {showSearch && searchOpen ? (
          <Box sx={{ pb: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Search products..."
              size="small"
              inputRef={searchInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#111827',
                  color: '#e2e8f0',
                  borderRadius: 2,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1f2937',
                },
                '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#334155',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#94a3b8',
                  opacity: 1,
                },
              }}
            />
          </Box>
        ) : null}
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography sx={{ px: 2, pb: 1.5, fontWeight: 700, color: '#0f172a' }}>Menu</Typography>
          <List sx={{ py: 0 }}>
            {[...baseLinks, ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : [])].map((link) => (
              <ListItemButton
                key={link.to}
                component={RouterLink}
                to={link.to}
                onClick={() => setMobileOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            {!isLoggedIn ? (
              <>
                <ListItemButton component={RouterLink} to="/login" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/signup" onClick={() => setMobileOpen(false)}>
                  <ListItemText primary="Signup" />
                </ListItemButton>
              </>
            ) : (
              <ListItemButton
                onClick={handleLogout}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}

export default Header
