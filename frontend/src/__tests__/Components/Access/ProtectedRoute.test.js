import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import ProtectedRoute from '../../../components/Access/ProtectedRoute'
import * as permissions from '../../../utils/permissions'

const mockStore = configureStore([])

describe('<ProtectedRoute />', () => {
  test('renders children when user has access', () => {
    const store = mockStore({ user: { role: 'admin' } })

    jest.spyOn(permissions, 'canAccessAdminPage').mockReturnValue(true)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <div>Admin Panel</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
  })

  test('redirects to home when user lacks access', () => {
    const store = mockStore({ user: { role: 'student' } })

    jest.spyOn(permissions, 'canAccessAdminPage').mockReturnValue(false)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <div>Admin Panel</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
