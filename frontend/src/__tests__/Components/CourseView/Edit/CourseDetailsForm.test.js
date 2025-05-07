import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CourseDetailsForm from '../../../../components/CourseView/Edit/CourseDetailsForm'

describe('<CourseDetailsForm />', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn()

  const defaultProps = {
    formState: {
      title: 'Computer Science',
      code: 'CS101',
      qualification: 'BSc',
      part_time: false,
    },
    qualifications: [
      { id: 1, qualification: 'BSc' },
      { id: 2, qualification: 'MSc' },
    ],
    handleCourseChange: mockHandleChange,
    handleCourseSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders form fields with correct initial values', () => {
    render(<CourseDetailsForm {...defaultProps} />)

    expect(screen.getByPlaceholderText(/title/i)).toHaveValue('Computer Science')
    expect(screen.getByPlaceholderText(/code/i)).toHaveValue('CS101')
    expect(screen.getByRole('combobox')).toHaveValue('BSc')
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  test('renders all qualifications in dropdown', () => {
    render(<CourseDetailsForm {...defaultProps} />)

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3) // "Select Qualification" + 2 qualifications
    expect(screen.getByText('BSc')).toBeInTheDocument()
    expect(screen.getByText('MSc')).toBeInTheDocument()
  })

  test('calls handleCourseChange on input/select/checkbox change', () => {
    render(<CourseDetailsForm {...defaultProps} />)

    fireEvent.change(screen.getByPlaceholderText(/title/i), { target: { value: 'New Title' } })
    fireEvent.change(screen.getByPlaceholderText(/code/i), { target: { value: 'NEW123' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'MSc' } })
    fireEvent.click(screen.getByRole('checkbox'))

    expect(mockHandleChange).toHaveBeenCalledTimes(4)
  })

  test('calls handleCourseSubmit on form submission', () => {
    render(<CourseDetailsForm {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    const form = submitButton.closest('form')

    fireEvent.submit(form)

    expect(mockHandleSubmit).toHaveBeenCalled()
  })
})
