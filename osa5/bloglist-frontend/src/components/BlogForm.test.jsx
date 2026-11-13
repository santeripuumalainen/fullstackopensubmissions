import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// 5.16
test('<BlogForm /> calls createBlog with the right details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title'), 'Testing forms')
  await user.type(screen.getByLabelText('author'), 'Kent C. Dodds')
  await user.type(screen.getByLabelText('url'), 'https://kentcdodds.com/')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'Kent C. Dodds',
    url: 'https://kentcdodds.com/'
  })
})
