import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Tools from '../../components/Tools'

describe('<Tools />', () => {
  const renderComponent = (user = null) => {
    render(
      <MemoryRouter>
        <Tools user={user} />
      </MemoryRouter>
    )
  }

  test('renders login tools when user is not logged in', () => {
    renderComponent(null)

    expect(screen.getByText(/What would you like to do today?/i)).toBeInTheDocument()
    expect(screen.getByText('Log In')).toBeInTheDocument()
    expect(screen.getByText('Reset Password')).toBeInTheDocument()
  })

  test('renders full toolset when user is logged in', () => {
    const mockUser = { id: 1, role: 2, forename: 'Alice', surname: 'Smith' }
    renderComponent(mockUser)

    expect(screen.getByText(/What would you like to do today?/i)).toBeInTheDocument()
    expect(screen.getByText('View Courses')).toBeInTheDocument()
    expect(screen.getByText('Meetings')).toBeInTheDocument()
    expect(screen.getByText('View Students')).toBeInTheDocument()
    expect(screen.getByText('Upload Students')).toBeInTheDocument()
    expect(screen.getByText('Upload Records')).toBeInTheDocument()
  })
})
