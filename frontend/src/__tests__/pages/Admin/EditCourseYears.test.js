import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EditCourseYears from '../../../pages/Admin/EditCourseYears'

describe('EditCourseYears', () => {
  test('renders initial course years', () => {
    render(<EditCourseYears />)

    expect(screen.getByText('2021')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  test('allows user to type a new year', () => {
    render(<EditCourseYears />)

    const input = screen.getByPlaceholderText(/add new course year/i)
    fireEvent.change(input, { target: { value: '2024' } })

    expect(input.value).toBe('2024')
  })

  test('adds a new course year when clicking the button', () => {
    render(<EditCourseYears />)

    const input = screen.getByPlaceholderText(/add new course year/i)
    const button = screen.getByText(/add course year/i)

    fireEvent.change(input, { target: { value: '2024' } })
    fireEvent.click(button)

    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(input.value).toBe('') // Input should clear after adding
  })

  test('does not add empty course year', () => {
    render(<EditCourseYears />)

    const button = screen.getByText(/add course year/i)
    fireEvent.click(button)

    // It should still only have the initial years
    expect(screen.queryAllByRole('listitem').length).toBe(3)
  })
})
