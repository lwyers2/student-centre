import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import EditModules from '../../../pages/Admin/EditModules'
import moduleService from '../../../services/module'

jest.mock('../../../components/Edit/Module/Module', () => {
  const MockModule = ({ modules }) => (
    <div data-testid="module-component">
      {modules.map(m => <div key={m.code}>{m.title}</div>)}
    </div>
  )
  MockModule.displayName = 'MockModule'
  return MockModule
})


// Mock navigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

// Mock module service
jest.mock('../../../services/module')

const mockStore = configureStore([])

describe('EditModules', () => {
  const mockModules = [
    { title: 'Intro to React', code: 'REACT101' },
    { title: 'Advanced JS', code: 'JS202' },
  ]

  it('redirects if user is not logged in', async () => {
    const store = mockStore({ user: null })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditModules />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('renders loading message when user data is not ready', () => {
    const store = mockStore({ user: null })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditModules />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/loading user/i)).toBeInTheDocument()
  })

  it('fetches and displays modules for a logged in user', async () => {
    const store = mockStore({ user: { id: '1', token: 'abc' } })
    moduleService.getAll.mockResolvedValueOnce(mockModules)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditModules />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('module-component')).toBeInTheDocument()
      expect(screen.getByText('Intro to React')).toBeInTheDocument()
      expect(screen.getByText('Advanced JS')).toBeInTheDocument()
    })
  })

  it('filters modules by search input', async () => {
    const store = mockStore({ user: { id: '1', token: 'abc' } })
    moduleService.getAll.mockResolvedValueOnce(mockModules)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditModules />
        </MemoryRouter>
      </Provider>
    )

    const input = await screen.findByPlaceholderText(/search modules/i)
    fireEvent.change(input, { target: { value: 'react' } })

    await waitFor(() => {
      expect(screen.getByText('Intro to React')).toBeInTheDocument()
      expect(screen.queryByText('Advanced JS')).not.toBeInTheDocument()
    })
  })

  it('displays fallback message when no modules match search', async () => {
    const store = mockStore({ user: { id: '1', token: 'abc' } })
    moduleService.getAll.mockResolvedValueOnce(mockModules)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditModules />
        </MemoryRouter>
      </Provider>
    )

    const input = await screen.findByPlaceholderText(/search modules/i)
    fireEvent.change(input, { target: { value: 'nonexistent' } })

    await waitFor(() => {
      expect(screen.getByText(/no courses found/i)).toBeInTheDocument()
    })
  })

  it('toggles the search box visibility', async () => {
    const store = mockStore({ user: { id: '1', token: 'abc' } })
    moduleService.getAll.mockResolvedValueOnce(mockModules)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditModules />
        </MemoryRouter>
      </Provider>
    )

    const toggleButton = await screen.findByRole('button', { name: /hide search/i })
    fireEvent.click(toggleButton)

    expect(screen.queryByPlaceholderText(/search modules/i)).not.toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(await screen.findByPlaceholderText(/search modules/i)).toBeInTheDocument()
  })
})
