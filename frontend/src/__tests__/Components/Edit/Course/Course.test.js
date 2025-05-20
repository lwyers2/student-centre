import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Course from '../../../../components/Edit/Course/Course'

const mockCourses = [
  {
    id: 1,
    code: 'CS101',
    title: 'Computer Science',
    qualification: 'BSc',
    school: 'Engineering',
    part_time: 0,
    years: 3,
  },
  {
    id: 2,
    code: 'MATH204',
    title: 'Mathematics',
    qualification: 'BSc',
    school: 'Science',
    part_time: 1,
    years: 4,
  },
]

describe('<Course /> - CourseList view', () => {
  test('renders all courses by default', () => {
    render(
      <MemoryRouter>
        <Course courses={mockCourses} />
      </MemoryRouter>
    )

    expect(screen.getByText(/All Courses/i)).toBeInTheDocument()
    expect(screen.getByText('CS101')).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.getByText('Full-Time')).toBeInTheDocument()
    expect(screen.getByText('Part-Time')).toBeInTheDocument()
  })

  test('filters courses by title', () => {
    render(
      <MemoryRouter>
        <Course courses={mockCourses} search="math" />
      </MemoryRouter>
    )

    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.queryByText('Computer Science')).not.toBeInTheDocument()
  })

  test('filters courses by code', () => {
    render(
      <MemoryRouter>
        <Course courses={mockCourses} search="cs101" />
      </MemoryRouter>
    )

    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.queryByText('Mathematics')).not.toBeInTheDocument()
  })

  test('renders correct number of rows', () => {
    render(
      <MemoryRouter>
        <Course courses={mockCourses} />
      </MemoryRouter>
    )

    // Should make 2 rows (excluding the header)
    expect(screen.getAllByText(/View/i)).toHaveLength(2)
  })

  test('returns empty table body if no course matches search', () => {
    render(
      <MemoryRouter>
        <Course courses={mockCourses} search="biology" />
      </MemoryRouter>
    )

    expect(screen.getByText(/All Courses/i)).toBeInTheDocument()
    const tableBody = screen.getByRole('table').querySelector('tbody')
    expect(tableBody?.children.length).toBe(0)
  })
})
