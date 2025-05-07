import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import Admin from '../../../pages/Admin/Admin'

// Mock navigate function
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockStore = configureStore([])

describe('<Admin />', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      user: { id: 1, role: 3, forename: 'Admin', surname: 'User' },
    })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Admin />
        </MemoryRouter>
      </Provider>
    )
  })

  test('renders all LinkCards with correct titles', () => {
    expect(screen.getByText('Manage Courses')).toBeInTheDocument()
    expect(screen.getByText('Manage Modules')).toBeInTheDocument()
    expect(screen.getByText('Manage Users')).toBeInTheDocument()
    expect(screen.getByText('Assign Users To Module Years')).toBeInTheDocument()
    expect(screen.getByText('Assign Users to Course Years')).toBeInTheDocument()
  })

  test('navigates when a LinkCard is clicked', () => {
    fireEvent.click(screen.getByText('Manage Courses'))
    expect(mockNavigate).toHaveBeenCalledWith('/edit-courses')

    fireEvent.click(screen.getByText('Assign Users to Course Years'))
    expect(mockNavigate).toHaveBeenCalledWith('/assign-course-years-to-users')
  })
})
