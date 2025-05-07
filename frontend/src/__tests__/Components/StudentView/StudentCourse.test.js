import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentCourse from '../../../components/StudentView/StudentCourse'

const mockCourses = [
  {
    course_year_id: 1,
    title: 'Computer Science Year 1',
    modules: [
      { flagged: 0 },
      { flagged: 1 },
      { flagged: 1 }
    ]
  },
  {
    course_year_id: 2,
    title: 'Mathematics Year 1',
    modules: [
      { flagged: 0 },
      { flagged: 0 }
    ]
  }
]

const mockStudent = {
  id: 42,
  forename: 'Alice',
  surname: 'Smith'
}

describe('<StudentCourse />', () => {
  test('renders table title and all course rows', () => {
    render(
      <MemoryRouter>
        <StudentCourse courses={mockCourses} student={mockStudent} />
      </MemoryRouter>
    )

    expect(screen.getByText(/View module results for Active Courses/i)).toBeInTheDocument()
    expect(screen.getByText('Computer Science Year 1')).toBeInTheDocument()
    expect(screen.getByText('Mathematics Year 1')).toBeInTheDocument()
  })

  test('calculates and displays correct number of flags per course', () => {
    render(
      <MemoryRouter>
        <StudentCourse courses={mockCourses} student={mockStudent} />
      </MemoryRouter>
    )

    expect(screen.getByText('2')).toBeInTheDocument() // CS course has 2 flagged modules
    expect(screen.getByText('0')).toBeInTheDocument() // Math course has 0 flagged
  })

  test('renders correct view link per course', () => {
    render(
      <MemoryRouter>
        <StudentCourse courses={mockCourses} student={mockStudent} />
      </MemoryRouter>
    )

    const viewButtons = screen.getAllByText('View')
    expect(viewButtons).toHaveLength(2)
    // Optional: check the href if using <Link> or inspect `state` if routing state is passed
  })
})
