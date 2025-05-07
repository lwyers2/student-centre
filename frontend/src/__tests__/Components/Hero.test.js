import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import Hero from '../../components/Hero'

const mockStore = configureStore([])

describe('<Hero />', () => {
  const renderWithUser = (user) => {
    const store = mockStore({ user })
    return render(
      <Provider store={store}>
        <Hero />
      </Provider>
    )
  }

  test('displays main hero heading as h2', () => {
    renderWithUser(null)
    const heading = screen.getByRole('heading', { level: 2, name: /Admin Centre/i })
    expect(heading).toBeInTheDocument()
  })

  test('displays welcome message when user is logged in', () => {
    const user = {
      prefix: 'Dr',
      forename: 'Alice',
      surname: 'Smith'
    }
    renderWithUser(user)
    expect(screen.getByText(/Welcome Dr. Alice Smith/)).toBeInTheDocument()
  })

  test('displays login prompt when user is not logged in', () => {
    renderWithUser(null)
    expect(screen.getByText(/Log in below to use admin Centre/)).toBeInTheDocument()
  })
})
