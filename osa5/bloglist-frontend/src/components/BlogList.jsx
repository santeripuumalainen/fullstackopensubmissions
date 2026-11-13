import { Link } from 'react-router-dom'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

const BlogList = ({ blogs }) => {
  // eniten tykkäyksiä saaneet ensin, puuttuva likes-kenttä tulkitaan nollaksi
  const sortedBlogs = [...blogs].sort(
    (a, b) => (b.likes ?? 0) - (a.likes ?? 0)
  )

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        blogs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>author</TableCell>
              <TableCell align="right">likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow key={blog.id} className="blog" hover>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
                <TableCell align="right">{blog.likes ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList
