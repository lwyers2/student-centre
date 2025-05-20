import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import CourseAccess from '../../../components/Access/CourseAccess'
import * as permissions from '../../../utils/permissions'

const mockStore = configureStore([])

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: '123' }),
}))

jest.useFakeTimers()

describe('<CourseAccess />', () => {
  test('renders children when access is allowed', () => {
    const store = mockStore({
      user: { accessible_courses: [123] },
    })

    jest.spyOn(permissions, 'canAccessResource').mockReturnValue(true)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/course/123']}>
          <Routes>
            <Route path="/course/:courseId" element={<CourseAccess><div>Course Content</div></CourseAccess>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText('Course Content')).toBeInTheDocument()
  })

  test('shows no-access message when access is denied', () => {
    const store = mockStore({
      user: { accessible_courses: [] },
    })

    jest.spyOn(permissions, 'canAccessResource').mockReturnValue(false)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/course/123']}>
          <Routes>
            <Route path="/course/:courseId" element={<CourseAccess><div>Course Content</div></CourseAccess>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/You don’t have permission/i)).toBeInTheDocument()
  })

  test('redirects after 10 seconds when access is denied', () => {
    const store = mockStore({
      user: { accessible_courses: [] },
    })

    jest.spyOn(permissions, 'canAccessResource').mockReturnValue(false)

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/course/123']}>
          <Routes>
            <Route path="/" element={<div>Home</div>} />
            <Route path="/course/:courseId" element={<CourseAccess><div>Course Content</div></CourseAccess>} />
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
