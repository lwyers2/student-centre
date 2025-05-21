import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import EditCourses from '../../../pages/Admin/EditCourses'
import courseService from '../../../services/course'

// Mocks
jest.mock('../../../components/Edit/Course/CourseFilters', () => {
  const MockCourseFilters = () => <div data-testid="course-filters" />
  MockCourseFilters.displayName = 'MockCourseFilters'
  return MockCourseFilters
})

jest.mock('../../../components/Edit/Course/FilteredCourseList', () => {
  const MockFilteredCourseList = () => <div data-testid="filtered-course-list" />
  MockFilteredCourseList.displayName = 'MockFilteredCourseList'
  return MockFilteredCourseList
})

jest.mock('../../../services/course')

// MOCK useNavigate AT THE TOP LEVEL
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

const mockStore = configureStore([])

describe('EditCourses', () => {
  const mockCourses = [
    { title: 'Math 101', code: 'MATH101', qualification: 'Bachelor', school: 'Science', part_time: 0 },
    { title: 'History 202', code: 'HIST202', qualification: 'Master', school: 'Arts', part_time: 1 },
  ]

  it('renders loading when no user', () => {
    const store = mockStore({ user: null })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCourses />
        </MemoryRouter>
      </Provider>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('redirects when user is not logged in', async () => {
    const store = mockStore({ user: null })

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCourses />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })

  it('fetches and displays courses for logged in user', async () => {
    const store = mockStore({ user: { id: '1', token: 'token123' } })
    courseService.getAll.mockResolvedValue(mockCourses)

    render(
      <Provider store={store}>
        <MemoryRouter>
          <EditCourses />
        </MemoryRouter>
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('course-filters')).toBeInTheDocument()
      expect(screen.getByTestId('filtered-course-list')).toBeInTheDocument()
    })

    expect(courseService.getAll).toHaveBeenCalledWith('token123')
  })
})
