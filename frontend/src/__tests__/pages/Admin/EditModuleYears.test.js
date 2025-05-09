import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EditModuleYears from '../../../pages/Admin/EditModuleYears'

describe('EditModuleYears', () => {
  test('renders initial module years', () => {
    render(<EditModuleYears />)
    expect(screen.getByText('2021')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  test('updates input value when typing', () => {
    render(<EditModuleYears />)
    const input = screen.getByPlaceholderText(/add new module year/i)
    fireEvent.change(input, { target: { value: '2024' } })
    expect(input.value).toBe('2024')
  })

  test('adds a new module year when clicking the button', () => {
    render(<EditModuleYears />)
    const input = screen.getByPlaceholderText(/add new module year/i)
    const button = screen.getByText(/add module year/i)

    fireEvent.change(input, { target: { value: '2024' } })
    fireEvent.click(button)

    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  test('does not add empty or whitespace-only year', () => {
    render(<EditModuleYears />)
    const input = screen.getByPlaceholderText(/add new module year/i)
    const button = screen.getByText(/add module year/i)

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(button)

    // Still only the original 3
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })
})
