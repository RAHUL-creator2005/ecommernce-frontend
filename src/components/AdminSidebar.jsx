import { NavLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: <DashboardOutlinedIcon /> },
  { label: 'Products', to: '/admin/products', icon: <Inventory2OutlinedIcon /> },
  { label: 'Orders', to: '/admin/orders', icon: <ReceiptLongOutlinedIcon /> },
  { label: 'Users', to: '/admin/users', icon: <PeopleOutlineIcon /> },
]

function AdminSidebar() {
  return (
    <Box
      sx={{
        width: { xs: '100%', md: 240 },
        flexShrink: 0,
        bgcolor: '#0f172a',
        color: '#fff',
        borderRight: { md: '1px solid #1f2937' },
      }}
    >
      <Box sx={{ px: 3, py: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
          Admin Panel
        </Typography>
        <Typography variant="caption" sx={{ color: '#cbd5f5' }}>
          Manage store data
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#1f2937' }} />
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              borderRadius: 1,
              my: 0.5,
              color: 'inherit',
              '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 },
              '&.active': { bgcolor: '#1f2937' },
              '&:hover': { bgcolor: '#1e293b' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}

export default AdminSidebar
