import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

// 5.27: yksittäisen blogin näkymän testit
describe('<Blog />', () => {
  const creator = {
    id: '5a43e6b6c37f3d065eaaa581',
    username: 'testaaja',
    name: 'Testi Testaaja'
  }

  const blog = {
    id: '5a43fde2cbd20b12a2c34e91',
    title: 'Component testing is done with react-testing-library',
    author: 'Kent C. Dodds',
    url: 'https://testing-library.com/',
    likes: 7,
    user: creator
  }

  const expectDetailsShown = () => {
    expect(
      screen.getByText('Component testing is done with react-testing-library')
    ).toBeVisible()
    expect(screen.getByText('by Kent C. Dodds')).toBeVisible()
    expect(screen.getByText('https://testing-library.com/')).toBeVisible()
    expect(screen.getByText('likes 7', { exact: false })).toBeVisible()
  }

  test('when not logged in, shows details and likes but no buttons', () => {
    render(<Blog blog={blog} user={null} />)

    expectDetailsShown()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  test('when logged in as another user, shows only the like button', () => {
    const otherUser = { username: 'toinen', name: 'Toinen Käyttäjä' }
    render(<Blog blog={blog} user={otherUser} />)

    expectDetailsShown()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveTextContent('like')
  })

  test('when logged in as the creator, also shows the remove button', () => {
    render(<Blog blog={blog} user={creator} />)

    expectDetailsShown()
    expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
  })

  test('clicking like twice calls the event handler twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} user={creator} handleLike={mockHandler} />)

    const user = userEvent.setup()
    const likeButton = screen.getByRole('button', { name: 'like' })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
