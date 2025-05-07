import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import StudentCourseModulesResults from '../../../components/StudentView/StudentCourseModulesResults'

const mockModules = [
  {
    module_year_id: 1,
    title: 'Software Engineering',
    result: 75,
    flagged: 0,
    resit: 0,
  },
  {
    module_year_id: 2,
    title: 'Data Structures',
    result: 45,
    flagged: 1,
    resit: 1,
  }
]

const mockStudent = {
  id: 123,
  forename: 'Alice',
  surname: 'Johnson'
}

describe('<StudentCourseModulesResults />', () => {
  test('renders academic year and all module data rows', () => {
    render(
      <MemoryRouter>
        <StudentCourseModulesResults student={mockStudent} modules={mockModules} year="2024" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year: 2024/)).toBeInTheDocument()
    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    expect(screen.getByText('Data Structures')).toBeInTheDocument()
  })

  test('displays correct values for each module', () => {
    render(
      <MemoryRouter>
        <StudentCourseModulesResults student={mockStudent} modules={mockModules} year="2024" />
      </MemoryRouter>
    )

    expect(screen.getByText('75')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(2)
    expect(screen.getAllByText('1')).toHaveLength(2)  // flagged and resit 1s
  })

  test('renders a view button for each module', () => {
    render(
      <MemoryRouter>
        <StudentCourseModulesResults student={mockStudent} modules={mockModules} year="2024" />
      </MemoryRouter>
    )

    const viewButtons = screen.getAllByText('View')
    expect(viewButtons).toHaveLength(2)
  })
})
