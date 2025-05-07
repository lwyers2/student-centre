import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentLetters from '../../../components/StudentView/StudentLetters'
import { format } from 'date-fns'

const mockStudent = {
  id: 42,
  forename: 'John',
  surname: 'Doe'
}

const mockLetters = [
  {
    id: 1,
    type: 'Warning',
    date_sent: '2024-05-01T12:00:00Z',
    sent_by: 'Admin User',
    module: {
      code: 'CS101',
      title: 'Intro to CS',
      year: 2024,
      module_year_id: 10
    }
  },
  {
    id: 2,
    type: 'Final',
    date_sent: '2024-06-01T12:00:00Z',
    sent_by: 'Staff User',
    module: {
      code: 'CS102',
      title: 'Data Structures',
      year: 2024,
      module_year_id: 11
    }
  }
]

describe('<StudentLetters />', () => {
  test('renders message if no letters are passed', () => {
    render(
      <MemoryRouter>
        <StudentLetters letters={[]} student={mockStudent} />
      </MemoryRouter>
    )
    expect(screen.getByText(/no letters issued/i)).toBeInTheDocument()
  })

  test('renders all letter rows with formatted content', () => {
    render(
      <MemoryRouter>
        <StudentLetters letters={mockLetters} student={mockStudent} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Letters Issued/i)).toBeInTheDocument()
    expect(screen.getByText('Warning')).toBeInTheDocument()
    expect(screen.getByText('Final')).toBeInTheDocument()
    expect(screen.getByText(format(new Date('2024-05-01T12:00:00Z'), 'dd MMM yyyy'))).toBeInTheDocument()
    expect(screen.getByText(format(new Date('2024-06-01T12:00:00Z'), 'dd MMM yyyy'))).toBeInTheDocument()
    expect(screen.getByText(/CS101 – Intro to CS/)).toBeInTheDocument()
    expect(screen.getByText(/CS102 – Data Structures/)).toBeInTheDocument()
    expect(screen.getAllByText('View')).toHaveLength(2)
  })
})
