import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Link as RouterLink } from 'react-router-dom'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'

const FALLBACK_IMAGE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MDAnIGhlaWdodD0nMzAwJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjZjNmNGY2Jy8+PHRleHQgeD0nNTAlJyB5PSc1MCUnIGRvbWluYW50LWJhc2VsaW5lPSdtaWRkbGUnIHRleHQtYW5jaG9yPSdtaWRkbGUnIGZpbGw9JyM2YjcyODAnIGZvbnQtZmFtaWx5PSdBcmlhbCcgZm9udC1zaXplPScyMCc+Tm8gaW1hZ2U8L3RleHQ+PC9zdmc+'

function ProductCard({ product, onAddToCart, onView, onLike }) {
  if (!product) {
    return null
  }

  const price = typeof product.price === 'number' ? product.price.toFixed(2) : product.price
  const detailsPath = product?._id ? `/products/${product._id}` : '#'
  const ratingValue =
    typeof product.rating === 'number' ? Math.min(5, Math.max(0, product.rating)) : null
  const reviewCount = typeof product.numReviews === 'number' ? product.numReviews : null
  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleView = () => {
    if (onView) {
      onView(product)
    }
  }

  const handleLike = () => {
    if (onLike) {
      onLike(product)
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        height: 430,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
        borderColor: '#e3e6e6',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          boxShadow: '0 6px 18px rgba(15, 23, 42, 0.12)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          height: 190,
          bgcolor: product.image ? '#ffffff' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
          position: 'relative',
        }}
      >
        <IconButton
          size="small"
          aria-label="like"
          onClick={handleLike}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: '#ffffff',
            border: '1px solid #e5e7eb',
            '&:hover': { bgcolor: '#f9fafb' },
          }}
        >
          <FavoriteBorder fontSize="small" />
        </IconButton>
        {product.image ? (
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src = FALLBACK_IMAGE
            }}
            sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            No image
          </Typography>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, px: 2, pt: 2, pb: 1, minHeight: 160 }}>
        {product.category ? (
          <Typography variant="caption" sx={{ color: '#6b7280', letterSpacing: 0.4 }}>
            {product.category}
          </Typography>
        ) : null}

        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: '#111827',
            mt: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            maxHeight: '2.6em',
            minHeight: '2.6em',
          }}
        >
          {product.title || product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            mb: 1,
            color: '#4b5563',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </Typography>

        {ratingValue !== null ? (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Rating value={ratingValue} precision={0.5} size="small" readOnly />
            {reviewCount !== null ? (
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                {reviewCount}
              </Typography>
            ) : null}
          </Stack>
        ) : null}

        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
          {price ? `Rs ${price}` : 'Price unavailable'}
        </Typography>

        <Typography variant="caption" sx={{ color: product.stock > 0 ? '#059669' : '#dc2626' }}>
          {product.stock > 0 ? 'In stock' : 'Out of stock'}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, gap: 1.5, mt: 'auto' }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleAdd}
          sx={{
            bgcolor: '#f0c14b',
            color: '#111827',
            '&:hover': { bgcolor: '#e2b33f' },
            flexGrow: 1,
          }}
        >
          Add to Cart
        </Button>
        <Button
          variant="outlined"
          size="small"
          component={RouterLink}
          to={detailsPath}
          onClick={handleView}
          sx={{ borderColor: '#d1d5db' }}
        >
          view
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard
