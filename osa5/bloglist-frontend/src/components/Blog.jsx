import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography
} from '@mui/material'

// Yksittäisen blogin näkymä (5.25), tyyliteltynä MUI:n Cardilla (5.31)
const Blog = ({ blog, user, handleLike, handleRemove }) => {
  if (!blog) {
    return null
  }

  // poistonappi näytetään vain blogin lisänneelle käyttäjälle
  const canRemove = user && blog.user && blog.user.username === user.username

  return (
    <Card sx={{ maxWidth: 700 }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Link href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </Link>
        <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
          <Chip label={`likes ${blog.likes ?? 0}`} color="primary" variant="outlined" />
          {blog.user && (
            <Typography variant="body2" color="text.secondary">
              added by {blog.user.name}
            </Typography>
          )}
        </Stack>
      </CardContent>
      {user && (
        <CardActions>
          <Button variant="contained" onClick={() => handleLike(blog)}>
            like
          </Button>
          {canRemove && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemove(blog)}
            >
              remove
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  )
}

export default Blog
