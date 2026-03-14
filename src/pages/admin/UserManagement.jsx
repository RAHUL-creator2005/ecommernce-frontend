import { useEffect, useMemo, useState } from 'react'
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
import userService from '../../services/userService'

const fallbackRoles = ['customer', 'user', 'admin']

function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })

  const roleOptions = useMemo(() => {
    const fromUsers = Array.from(new Set(users.map((user) => user.role).filter(Boolean)))
    const merged = [...new Set([...fromUsers, ...fallbackRoles])]
    return merged
  }, [users])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const { data } = await userService.getUsers()
      setUsers(data?.users || [])
    } catch (err) {
      setError(err?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleRoleChange = async (userId, nextRole) => {
    try {
      setUpdatingId(userId)
      await userService.updateUserRole(userId, { role: nextRole })
      setToast({ open: true, message: 'Role updated', severity: 'success' })
      await loadUsers()
    } catch (err) {
      setToast({ open: true, message: err?.message || 'Failed to update role', severity: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (user) => {
    if (!user?._id) return
    const ok = window.confirm(`Delete user ${user.email || user.name || ''}?`)
    if (!ok) return

    try {
      setDeletingId(user._id)
      await userService.deleteUser(user._id)
      setToast({ open: true, message: 'User deleted', severity: 'success' })
      await loadUsers()
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
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Review users and update roles.
              </Typography>
            </Stack>

            {loading ? (
              <Box sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : users.length === 0 ? (
              <Alert severity="info">No users found.</Alert>
            ) : (
              <Paper variant="outlined" sx={{ borderColor: '#e3e6e6' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>{user._id}</TableCell>
                        <TableCell>{user.name || user.username || 'User'}</TableCell>
                        <TableCell>{user.email || '-'}</TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={user.role || 'customer'}
                            onChange={(event) => handleRoleChange(user._id, event.target.value)}
                            disabled={updatingId === user._id}
                          >
                            {roleOptions.map((role) => (
                              <MenuItem key={role} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDelete(user)}
                            disabled={deletingId === user._id}
                            aria-label="Delete user"
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

export default UserManagement
