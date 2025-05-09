import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CourseFilters from '../../../../components/Edit/Course/CourseFilters'

describe('<CourseFilters />', () => {
  const mockProps = {
    search: '',
    setSearch: jest.fn(),
    qualification: '',
    setQualification: jest.fn(),
    school: '',
    setSchool: jest.fn(),
    fullTime: '',
    setFullTime: jest.fn(),
    uniqueQualifications: ['BSc', 'MSc'],
    uniqueSchools: ['Engineering', 'Science'],
    uniqueFullTimeStatus: ['Full-Time', 'Part-Time'],
    showFilters: true,
    toggleFilters: jest.fn(),
  }

  test('renders all filter inputs and button', () => {
    render(<CourseFilters {...mockProps} />)

    expect(screen.getByText('Search & Filters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search courses...')).toBeInTheDocument()
    expect(screen.getByLabelText('Qualification')).toBeInTheDocument()
    expect(screen.getByLabelText('School')).toBeInTheDocument()
    expect(screen.getByLabelText('Full-Time/Part-Time')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hide filters/i })).toBeInTheDocument()
  })

  test('triggers toggleFilters when button clicked', () => {
    render(<CourseFilters {...mockProps} />)
    const toggleButton = screen.getByRole('button', { name: /hide filters/i })
    fireEvent.click(toggleButton)
    expect(mockProps.toggleFilters).toHaveBeenCalled()
  })

  test('calls setSearch when typing in search input', () => {
    render(<CourseFilters {...mockProps} />)
    const input = screen.getByPlaceholderText('Search courses...')
    fireEvent.change(input, { target: { value: 'math' } })
    expect(mockProps.setSearch).toHaveBeenCalledWith('math')
  })

  test('renders correct options for dropdowns', () => {
    render(<CourseFilters {...mockProps} />)

    mockProps.uniqueQualifications.forEach(qual =>
      expect(screen.getByLabelText('Qualification')).toHaveTextContent(qual)
    )

    mockProps.uniqueSchools.forEach(school =>
      expect(screen.getByLabelText('School')).toHaveTextContent(school)
    )

    mockProps.uniqueFullTimeStatus.forEach(status =>
      expect(screen.getByLabelText('Full-Time/Part-Time')).toHaveTextContent(status)
    )
  })
})
