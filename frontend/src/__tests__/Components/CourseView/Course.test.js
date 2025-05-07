import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Course from '../../../components/CourseView/Course'

const mockCourse = {
  title: 'Computer Science',
  code: 'CS101',
  qualification: 'BSc',
  part_time: 0,
  course_years: [
    {
      id: 1,
      year_start: 2022,
      year_end: 2023,
      course_coordinator: 'Dr. Alice Smith',
    },
    {
      id: 2,
      year_start: 2023,
      year_end: 2024,
      course_coordinator: 'Prof. Bob Jones',
    },
  ],
}

describe('<Course />', () => {
  test('renders table with all course years by default', () => {
    render(
      <MemoryRouter>
        <Course course={mockCourse} search="" yearStart="" yearEnd="" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Computer Science \(BSc\) CS101\/FY/)).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getAllByText('2023')).toHaveLength(2) // year_end (row 1) + year_start (row 2)
    expect(screen.getByText('Dr. Alice Smith')).toBeInTheDocument()
    expect(screen.getByText('Prof. Bob Jones')).toBeInTheDocument()
  })

  test('filters course years by search text', () => {
    render(
      <MemoryRouter>
        <Course course={mockCourse} search="bob" yearStart="" yearEnd="" />
      </MemoryRouter>
    )

    expect(screen.getByText('Prof. Bob Jones')).toBeInTheDocument()
    expect(screen.queryByText('Dr. Alice Smith')).not.toBeInTheDocument()
  })

  test('filters by yearStart', () => {
    render(
      <MemoryRouter>
        <Course course={mockCourse} search="" yearStart="2022" yearEnd="" />
      </MemoryRouter>
    )

    expect(screen.getByText('Dr. Alice Smith')).toBeInTheDocument()
    expect(screen.queryByText('Prof. Bob Jones')).not.toBeInTheDocument()
  })

  test('filters by yearEnd', () => {
    render(
      <MemoryRouter>
        <Course course={mockCourse} search="" yearStart="" yearEnd="2024" />
      </MemoryRouter>
    )

    expect(screen.getByText('Prof. Bob Jones')).toBeInTheDocument()
    expect(screen.queryByText('Dr. Alice Smith')).not.toBeInTheDocument()
  })

  test('returns null if no course years match filters', () => {
    const { container } = render(
      <MemoryRouter>
        <Course course={mockCourse} search="math" yearStart="" yearEnd="" />
      </MemoryRouter>
    )

    expect(container.firstChild).toBeNull()
  })
})
