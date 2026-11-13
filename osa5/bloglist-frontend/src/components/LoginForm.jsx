import { useState } from 'react'
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'

// 5.29: tyylitelty kirjautumislomake
const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()
    const success = await handleLogin({ username, password })
    if (success) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        log in to application
      </Typography>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="username"
          />
          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="current-password"
          />
          <Button type="submit" variant="contained">
            login
          </Button>
        </Stack>
      </Box>
    </Paper>
  )
}

export default LoginForm
