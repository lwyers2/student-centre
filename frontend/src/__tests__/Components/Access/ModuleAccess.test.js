import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import ModuleAccess from '../../../components/Access/ModuleAccess'
import * as permissions from '../../../utils/permissions'

const mockStore = configureStore([])

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ moduleId: '789' }),
}))

jest.useFakeTimers()

describe('<ModuleAccess />', () => {
  test('renders children when access is allowed', () => {
    const store = mockStore({
      user: { accessible_modules: [789] },
    })

    jest.spyOn(permissions, 'canAccessResource').mockReturnValue(true)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/module/789']}>
          <Routes>
            <Route
              path="/module/:moduleId"
              element={
                <ModuleAccess>
                  <div>Module Content</div>
                </ModuleAccess>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Module Content')).toBeInTheDocument()
  })

  test('shows no-access message when access is denied', () => {
    const store = mockStore({
      user: { accessible_modules: [] },
    })

    jest.spyOn(permissions, 'canAccessResource').mockReturnValue(false)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/module/789']}>
          <Routes>
            <Route
              path="/module/:moduleId"
              element={
                <ModuleAccess>
                  <div>Module Content</div>
                </ModuleAccess>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/You don’t have permission to view this module/i)).toBeInTheDocument()
  })

  test('redirects after 10 seconds when access is denied', () => {
    const store = mockStore({
      user: { accessible_modules: [] },
    })

    jest.spyOn(permissions, 'canAccessResource').mockReturnValue(false)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/module/789']}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route
              path="/module/:moduleId"
              element={
                <ModuleAccess>
                  <div>Module Content</div>
                </ModuleAccess>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/You don’t have permission/i)).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(10000)
    })

    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
