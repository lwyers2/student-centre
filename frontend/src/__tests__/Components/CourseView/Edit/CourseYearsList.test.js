import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CourseYearsList from '../../../../components/CourseView/Edit/CourseYearsList'
import courseService from '../../../../services/course'

jest.mock('../../../../services/course')

describe('<CourseYearsList />', () => {
  const mockSetEditingYears = jest.fn()
  const mockSetCourseYears = jest.fn()

  const mockUser = { token: 'fake-token' }

  const teachers = [
    { id: 1, role: 'Teacher', forename: 'Jane', surname: 'Doe', prefix: 'Dr' },
    { id: 2, role: 'Teacher', forename: 'John', surname: 'Smith', prefix: 'Mr' }
  ]

  const courseYears = [
    { id: 101, year_start: 2022, year_end: 2023, course_coordinator: 'Dr. Jane Doe' }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
  })


  test('renders course year and coordinator', () => {
    render(
      <CourseYearsList
        courseId={1}
        courseYears={courseYears}
        setCourseYears={mockSetCourseYears}
        editingYears={{}}
        setEditingYears={mockSetEditingYears}
        users={teachers}
        user={mockUser}
      />
    )

    expect(screen.getByText(/2022 - 2023/)).toBeInTheDocument()
    expect(screen.getByText(/Coordinator: Dr. Jane Doe/)).toBeInTheDocument()
  })

  test('enters edit mode and shows coordinator dropdown', () => {
    render(
      <CourseYearsList
        courseId={1}
        courseYears={courseYears}
        setCourseYears={mockSetCourseYears}
        editingYears={{ 101: true }}
        setEditingYears={mockSetEditingYears}
        users={teachers}
        user={mockUser}
      />
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3) // Default + 2 teachers
  })

  test('calls setEditingYears on edit button click', () => {
    render(
      <CourseYearsList
        courseId={1}
        courseYears={courseYears}
        setCourseYears={mockSetCourseYears}
        editingYears={{}}
        setEditingYears={mockSetEditingYears}
        users={teachers}
        user={mockUser}
      />
    )

    fireEvent.click(screen.getByText('Edit'))
    expect(mockSetEditingYears).toHaveBeenCalledWith(expect.any(Function))
  })

  test('saves coordinator change', async () => {
    courseService.updateCourseYear.mockResolvedValue({ success: true })

    const updatedCourseYears = [
      {
        ...courseYears[0],
        course_coordinator: 'Mr. John Smith'
      }
    ]

    render(
      <CourseYearsList
        courseId={1}
        courseYears={courseYears}
        setCourseYears={mockSetCourseYears}
        editingYears={{ 101: true }}
        setEditingYears={mockSetEditingYears}
        users={teachers}
        user={mockUser}
      />
    )

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(courseService.updateCourseYear).toHaveBeenCalledWith(
        'fake-token',
        1,
        101,
        2
      )
    })

    expect(mockSetCourseYears).toHaveBeenCalledWith(updatedCourseYears)
    expect(mockSetEditingYears).toHaveBeenCalledWith(expect.any(Function))
  })
})
