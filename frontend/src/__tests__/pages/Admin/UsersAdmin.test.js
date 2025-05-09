import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import UsersAdmin from '../../../pages/Admin/UsersAdmin'
import userService from '../../../services/user'

// Mocks
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('../../../services/user')

const mockStore = configureStore([])

describe('UsersAdmin', () => {
  const mockUser = { id: 'admin123', token: 'abc' }
  const mockUsers = [
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'student' },
    { id: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'admin' },
  ]

  beforeEach(() => {
    userService.getAll.mockResolvedValue(mockUsers)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    const store = mockStore({ user: mockUser })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <UsersAdmin />
        </MemoryRouter>
      </Provider>
    )
  }

  test('fetches and displays user list', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument()
    })
  })

  test('filters users by search input', async () => {
    renderComponent()

    const input = await screen.findByPlaceholderText(/search by name or email/i)
    fireEvent.change(input, { target: { value: 'alice' } })

    expect(await screen.findByText('Alice Smith')).toBeInTheDocument()
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument()
  })

  test('shows fallback message if no users match search', async () => {
    renderComponent()

    const input = await screen.findByPlaceholderText(/search by name or email/i)
    fireEvent.change(input, { target: { value: 'nonexistent' } })

    expect(await screen.findByText(/no users found/i)).toBeInTheDocument()
  })

  test('navigates to user creation page', async () => {
    renderComponent()

    const button = await screen.findByText('+ Add New User')
    fireEvent.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/users/new')
  })

  test('navigates to user edit page when a user is clicked', async () => {
    renderComponent()

    const userItem = await screen.findByText('Alice Smith')
    fireEvent.click(userItem)

    expect(mockNavigate).toHaveBeenCalledWith('/users/1/edit')
  })
})
