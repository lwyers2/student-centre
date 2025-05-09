import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import configureStore from 'redux-mock-store'
import EditCourse from '../../../pages/Course/EditCourse'
import courseService from '../../../services/course'
import qualificationsService from '../../../services/qualifications'

// Mock child components
jest.mock('../../../components/CourseView/Edit/CourseDetailsForm', () => {
  const Mock = () => <div data-testid="course-details-form" />
  Mock.displayName = 'MockCourseDetailsForm'
  return Mock
})

jest.mock('../../../components/CourseView/Edit/CourseYearsList', () => {
  const Mock = () => <div data-testid="course-years-list" />
  Mock.displayName = 'MockCourseYearsList'
  return Mock
})

jest.mock('../../../components/CourseView/Edit/AddCourseYearForm', () => {
  const Mock = () => <div data-testid="add-course-year-form" />
  Mock.displayName = 'MockAddCourseYearForm'
  return Mock
})

// Mock navigation and params
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ courseId: '123' })
}))

// Mock services
jest.mock('../../../services/course')
jest.mock('../../../services/qualifications')

const mockStore = configureStore([])

describe('EditCourse page', () => {
  const user = { id: '1', token: 'test-token' }
  const mockCourse = {
    id: '123',
    title: 'Test Course',
    code: 'TC101',
    qualification: 'Bachelor',
    part_time: false,
    school: 'Science',
    years: 2
  }

  const mockUsers = [
    { id: 1, prefix: 'Dr', forename: 'Alice', surname: 'Smith' },
    { id: 2, prefix: 'Prof', forename: 'Bob', surname: 'Jones' }
  ]

  const mockCourseYears = [
    { year_start: 2022, course_coordinator: 'Dr. Alice Smith' },
    { year_start: 2023, course_coordinator: 'Prof. Bob Jones' }
  ]

  beforeEach(() => {
    courseService.getOneCourse.mockResolvedValue({
      course: mockCourse,
      course_years: mockCourseYears,
      users: mockUsers
    })

    qualificationsService.getAll.mockResolvedValue([
      { id: 1, name: 'Bachelor' },
      { id: 2, name: 'Master' }
    ])
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = async (userOverride = user) => {
    const store = mockStore({ user: userOverride })

    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <EditCourse />
          </MemoryRouter>
        </Provider>
      )
    })
  }

  test('redirects if user is not present', async () => {
    await renderComponent(null)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  test('shows loading initially when no course loaded', async () => {
    // simulate a delay
    courseService.getOneCourse.mockImplementationOnce(() => new Promise(() => {}))

    await renderComponent()
    expect(screen.getByText(/loading course/i)).toBeInTheDocument()
  })

  test('renders course title, code and all subcomponents', async () => {
    await renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Edit Course')).toBeInTheDocument()
      expect(screen.getByText('Test Course (TC101)')).toBeInTheDocument()
      expect(screen.getByTestId('course-details-form')).toBeInTheDocument()
      expect(screen.getByTestId('course-years-list')).toBeInTheDocument()
      expect(screen.getByTestId('add-course-year-form')).toBeInTheDocument()
    })
  })

  test('handles failed course fetch gracefully', async () => {
    courseService.getOneCourse.mockRejectedValueOnce(new Error('fail'))

    await renderComponent()

    await waitFor(() => {
      expect(screen.getByText(/loading course/i)).toBeInTheDocument()
    })
  })
})
