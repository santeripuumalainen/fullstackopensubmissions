import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useMatch,
  useNavigate
} from 'react-router-dom'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

// 5.30: navigaation napeille näkyvä hover-tila
const navButtonStyle = {
  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  // kirjautuminen säilyy sivun uudelleenlatauksen yli
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (!loggedUserJSON) {
      return null
    }
    const loggedUser = JSON.parse(loggedUserJSON)
    blogService.setToken(loggedUser.token)
    return loggedUser
  })
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
      return true
    } catch {
      notify('wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      // backend palauttaa käyttäjästä vain id:n, joten liitetään nimitiedot itse
      const blogWithUser = {
        ...returnedBlog,
        user: { id: returnedBlog.user, username: user.username, name: user.name }
      }
      setBlogs(blogs.concat(blogWithUser))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      navigate('/')
      return true
    } catch (error) {
      notify(error.response?.data?.error ?? 'creating the blog failed', 'error')
      return false
    }
  }

  // koko blogi lähetetään, user pelkkänä id:nä
  const handleLike = async (blog) => {
    const updatedBlog = {
      user: blog.user?.id,
      likes: (blog.likes ?? 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      // säilytetään lisääjän tiedot, vaikka vastauksessa olisi vain id
      setBlogs(
        blogs.map((b) =>
          b.id === blog.id ? { ...returnedBlog, user: blog.user } : b
        )
      )
    } catch (error) {
      notify(error.response?.data?.error ?? 'liking the blog failed', 'error')
    }
  }

  const handleRemove = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      notify(`removed ${blog.title} by ${blog.author}`)
      navigate('/')
    } catch (error) {
      notify(error.response?.data?.error ?? 'removing the blog failed', 'error')
    }
  }

  return (
    <Container>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={navButtonStyle}>
            blogs
          </Button>
          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/create"
              sx={navButtonStyle}
            >
              create new
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {user ? (
            <>
              <Typography sx={{ mr: 2 }}>{user.name} logged in</Typography>
              <Button
                color="inherit"
                variant="outlined"
                onClick={handleLogout}
                sx={navButtonStyle}
              >
                logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={navButtonStyle}
            >
              login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <BlogForm createBlog={createBlog} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm handleLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Container>
  )
}

export default App
