import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from '../../components/LoginForm'
import loginService from '../../services/login'

// Mock the login service
jest.mock('../../services/login', () => ({
  login: jest.fn(),
}))

const mockStore = configureStore([])

describe('<LoginForm />', () => {
  let store

  beforeEach(() => {
    store = mockStore({})
    store.dispatch = jest.fn()
  })

  const renderWithProviders = (ui) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>
    )
  }

  test('renders email and password fields and login button', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  test('submits login credentials and dispatches setUser on success', async () => {
    const mockUser = { id: 1, name: 'Test User', token: '123abc' }
    loginService.login.mockResolvedValueOnce(mockUser)

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(store.dispatch).toHaveBeenCalled()
    })
  })

  test('shows error message on failed login', async () => {
    loginService.login.mockRejectedValueOnce(new Error('Invalid credentials'))

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    })

    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    const errorMessage = await screen.findByText(/invalid email or password/i)
    expect(errorMessage).toBeInTheDocument()
  })
})
