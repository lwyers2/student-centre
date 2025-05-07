import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import Header from '../../components/Header'

const mockStore = configureStore([])

describe('<Header />', () => {
  const renderWithStore = (user) => {
    const store = mockStore({ user })
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    )
  }

  test('renders logo and site title', () => {
    renderWithStore(null)
    expect(screen.getByAltText(/Queen's University Belfast Logo/i)).toBeInTheDocument()
    expect(screen.getByText(/QUB Student Results/i)).toBeInTheDocument()
  })

  test('shows login link when user is not logged in', () => {
    renderWithStore(null)
    expect(screen.getByText(/Log in/i)).toBeInTheDocument()
  })

  test('shows admin link and logout for admin users', () => {
    renderWithStore({ role: 3 })
    expect(screen.getByText(/Admin/i)).toBeInTheDocument()
    expect(screen.getByText(/Log Out/i)).toBeInTheDocument()
  })

  test('shows regular user nav links and logout', () => {
    renderWithStore({ role: 1 })
    expect(screen.getByText(/Upload Records/i)).toBeInTheDocument()
    expect(screen.getByText(/View Courses/i)).toBeInTheDocument()
    expect(screen.getByText(/View Modules/i)).toBeInTheDocument()
    expect(screen.getByText(/View Students/i)).toBeInTheDocument()
    expect(screen.getByText(/Meetings/i)).toBeInTheDocument()
    expect(screen.getByText(/Log Out/i)).toBeInTheDocument()
  })

  test('calls logout when Log Out is clicked', () => {
    const store = mockStore({ user: { role: 3 } })
    store.dispatch = jest.fn()

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    )

    fireEvent.click(screen.getByText(/Log Out/i))
    expect(store.dispatch).toHaveBeenCalled()
  })
})
