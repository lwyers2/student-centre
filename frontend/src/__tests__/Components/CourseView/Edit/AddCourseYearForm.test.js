import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AddCourseYearForm from '../../../../components/CourseView/Edit/AddCourseYearForm'

describe('<AddCourseYearForm />', () => {
  const mockSetShowAddYear = jest.fn()
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn()

  const defaultProps = {
    showAddYear: false,
    setShowAddYear: mockSetShowAddYear,
    newYear: { year_start: 2023, course_coordinator_id: '' },
    handleNewYearChange: mockHandleChange,
    handleNewYearSubmit: mockHandleSubmit,
    users: [
      { id: 1, role: 'Teacher', forename: 'Jane', surname: 'Doe', prefix: 'Dr' },
      { id: 2, role: 'Student', forename: 'John', surname: 'Smith', prefix: 'Mr' },
    ],
    courseYearsAmount: 1,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('toggles form visibility', () => {
    render(<AddCourseYearForm {...defaultProps} />)

    const toggleButton = screen.getByRole('button', { name: /add new course year/i })
    fireEvent.click(toggleButton)

    expect(mockSetShowAddYear).toHaveBeenCalledWith(expect.any(Function))
  })

  test('renders form when showAddYear is true', () => {
    render(<AddCourseYearForm {...defaultProps} showAddYear={true} />)

    expect(screen.getByPlaceholderText(/year start/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/year end/i)).toHaveValue(2024) // 2023 + 1
    expect(screen.getByText(/select coordinator/i)).toBeInTheDocument()
  })

  test('filters only teachers in coordinator dropdown', () => {
    render(<AddCourseYearForm {...defaultProps} showAddYear={true} />)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(2) // "Select Coordinator" + 1 Teacher
    expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument()
    expect(screen.queryByText('Mr. John Smith')).not.toBeInTheDocument()
  })

  test('calls handleNewYearChange on input/select change', () => {
    render(<AddCourseYearForm {...defaultProps} showAddYear={true} />)

    const yearInput = screen.getByPlaceholderText(/year start/i)
    fireEvent.change(yearInput, { target: { value: '2024' } })
    expect(mockHandleChange).toHaveBeenCalled()

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '1' } })
    expect(mockHandleChange).toHaveBeenCalled()
  })

  test('calls handleNewYearSubmit on form submission', () => {
    render(<AddCourseYearForm {...defaultProps} showAddYear={true} />)

    const submitButton = screen.getByRole('button', { name: 'Add Year' })
    const form = submitButton.closest('form')
    fireEvent.submit(form)

    expect(mockHandleSubmit).toHaveBeenCalled()
  })

})
