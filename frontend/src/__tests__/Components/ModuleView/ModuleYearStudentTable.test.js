import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ModuleYearStudentTable from '../../../components/ModuleView/ModuleYearStudentTable'

const mockStudents = [
  {
    id: 1,
    student_code: 'S12345',
    forename: 'Alice',
    surname: 'Johnson',
    email: 'alice@example.com',
    result: 85,
  },
  {
    id: 2,
    student_code: 'S67890',
    forename: 'Bob',
    surname: 'Smith',
    email: 'bob@example.com',
    result: 92,
  },
]

describe('<ModuleYearStudentTable />', () => {
  test('renders student table with correct headers and values', () => {
    render(<ModuleYearStudentTable students={mockStudents} onEditResult={jest.fn()} />)

    expect(screen.getByText('Student Code')).toBeInTheDocument()
    expect(screen.getByText('Forename')).toBeInTheDocument()
    expect(screen.getByText('Surname')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Result')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()

    expect(screen.getByText('S12345')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Johnson')).toBeInTheDocument()
    expect(screen.getByText('alice@example.com')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()

    expect(screen.getByText('S67890')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Smith')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
    expect(screen.getByText('92')).toBeInTheDocument()
  })

  test('calls onEditResult with correct student when button clicked', () => {
    const handleEdit = jest.fn()
    render(<ModuleYearStudentTable students={mockStudents} onEditResult={handleEdit} />)

    const buttons = screen.getAllByText('Edit Result')
    fireEvent.click(buttons[0])

    expect(handleEdit).toHaveBeenCalledWith(mockStudents[0])

    fireEvent.click(buttons[1])
    expect(handleEdit).toHaveBeenCalledWith(mockStudents[1])
  })
})
