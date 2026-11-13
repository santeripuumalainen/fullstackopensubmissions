import { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'

// 5.29: tyylitelty uuden blogin lomake
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    const success = await createBlog({ title, author, url })
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        create new
      </Typography>
      <Box component="form" onSubmit={addBlog}>
        <Stack spacing={2}>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
          <TextField
            label="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
          <TextField
            label="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
          <Button type="submit" variant="contained">
            create
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default BlogForm
