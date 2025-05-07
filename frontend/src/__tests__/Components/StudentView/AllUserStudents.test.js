import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AllUserStudents from '../../../components/StudentView/AllUserStudents'

const mockStudents = [
  {
    id: 1,
    forename: 'Alice',
    surname: 'Smith',
    student_code: 'S1234',
    email: 'alice@example.com',
  },
  {
    id: 2,
    forename: 'Bob',
    surname: 'Jones',
    student_code: 'S5678',
    email: 'bob@example.com',
  },
]

describe('<AllUserStudents />', () => {
  test('renders all students by default', () => {
    render(
      <MemoryRouter>
        <AllUserStudents students={mockStudents} search="" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Showing students from your assigned modules/i)).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('S1234')).toBeInTheDocument()
    expect(screen.getByText('S5678')).toBeInTheDocument()
  })

  test('filters students by search term', () => {
    render(
      <MemoryRouter>
        <AllUserStudents students={mockStudents} search="alice" />
      </MemoryRouter>
    )

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })

  test('renders empty table if no matches', () => {
    render(
      <MemoryRouter>
        <AllUserStudents students={mockStudents} search="nonexistent" />
      </MemoryRouter>
    )

    // Only the table header should be present, no rows with student names
    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob')).not.toBeInTheDocument()
  })
})
