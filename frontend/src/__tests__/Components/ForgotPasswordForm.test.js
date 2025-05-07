// frontend/src/__tests__/Components/ForgotPasswordForm.test.js
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ForgotPasswordForm from '../../components/ForgotPasswordForm'

describe('<ForgotPasswordForm />', () => {
  const mockToggleForm = jest.fn()

  beforeEach(() => {
    render(<ForgotPasswordForm toggleForm={mockToggleForm} />)
  })

  test('renders the reset password heading', () => {
    expect(screen.getByRole('heading', { name: /reset password/i })).toBeInTheDocument()
  })

  test('renders email input field', () => {
    const input = screen.getByLabelText(/email/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'email')
  })

  test('calls toggleForm when "Send Reset Link" is clicked', () => {
    const button = screen.getByRole('button', { name: /send reset link/i })
    fireEvent.click(button)
    expect(mockToggleForm).toHaveBeenCalledTimes(1)
  })
})
