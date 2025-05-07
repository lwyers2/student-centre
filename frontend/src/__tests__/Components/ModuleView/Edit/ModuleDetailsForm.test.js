import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModuleDetailsForm from '../../../../components/ModuleView/Edit/ModuleDetailsForm'

describe('<ModuleDetailsForm />', () => {
  const mockHandleChange = jest.fn()
  const mockHandleSubmit = jest.fn(e => e.preventDefault())

  const defaultProps = {
    formState: {
      title: 'Software Engineering',
      code: 'SE300',
      CATs: '20',
      year: '3',
    },
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders all input fields with correct values', () => {
    render(<ModuleDetailsForm {...defaultProps} />)

    expect(screen.getByPlaceholderText(/title/i)).toHaveValue('Software Engineering')
    expect(screen.getByPlaceholderText(/code/i)).toHaveValue('SE300')
    expect(screen.getByPlaceholderText(/CATs/i)).toHaveValue('20')
    expect(screen.getByPlaceholderText(/year/i)).toHaveValue('3')
  })

  test('calls handleChange when input values change', () => {
    render(<ModuleDetailsForm {...defaultProps} />)

    const titleInput = screen.getByPlaceholderText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'New Title' } })

    expect(mockHandleChange).toHaveBeenCalled()
  })

  test('calls handleSubmit on form submission', () => {
    render(<ModuleDetailsForm {...defaultProps} />)

    const form = screen.getByText(/save changes/i).closest('form')
    fireEvent.submit(form)

    expect(mockHandleSubmit).toHaveBeenCalled()
  })
})
