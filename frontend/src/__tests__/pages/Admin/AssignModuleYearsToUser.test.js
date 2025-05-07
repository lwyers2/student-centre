import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import AssignModuleYearsToUser from '../../../pages/Admin/AssignModuleYearsToUser'
import userService from '../../../services/user'

// Mock useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

// Mock user service
jest.mock('../../../services/user')

const mockStore = configureStore([])

describe('<AssignModuleYearsToUser />', () => {
  const usersMock = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Teacher' },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', role: 'Admin' }
  ]

  beforeEach(() => {
    userService.getAll.mockResolvedValue(usersMock)
  })

  test('renders users and allows filtering', async () => {
    const store = mockStore({
      user: { token: 'test-token' }
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AssignModuleYearsToUser />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/Select Users to Add Modules/)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument()
      expect(screen.getByText('Bob Jones')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText(/Search by name or email/), {
      target: { value: 'alice' }
    })

    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument()
    expect(screen.getByText('Alice Smith')).toBeInTheDocument()
  })

  test('navigates to module assignment page on user click', async () => {
    const store = mockStore({
      user: { token: 'test-token' }
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <AssignModuleYearsToUser />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => screen.getByText('Alice Smith'))

    fireEvent.click(screen.getByText('Alice Smith'))

    expect(mockNavigate).toHaveBeenCalledWith('/users/1/add-modules')
  })
})
