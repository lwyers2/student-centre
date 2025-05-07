import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ModuleSummaryModuleYears from '../../../components/ModuleView/ModuleSummaryModuleYears'

const moduleYearWithStudents = {
  module_year_id: 1,
  year_start: 2023,
  semester: 'Spring',
  module_coordinator: 'Dr. Alice Smith',
  students: [
    { result: 80, flagged: 0 },
    { result: 70, flagged: 1 },
    { result: 90, flagged: 0 }
  ]
}

const moduleYearWithoutStudents = {
  module_year_id: 2,
  year_start: 2023,
  semester: 'Autumn',
  module_coordinator: 'Dr. Bob Jones',
  students: []
}

describe('<ModuleSummaryModuleYears />', () => {
  test('renders stats and links when students are present', () => {
    render(
      <MemoryRouter>
        <ModuleSummaryModuleYears moduleYear={moduleYearWithStudents} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year Start: 2023/)).toBeInTheDocument()
    expect(screen.getByText(/Semester: Spring/)).toBeInTheDocument()
    expect(screen.getByText(/Module Co-ordinator: Dr. Alice Smith/)).toBeInTheDocument()
    expect(screen.getByText(/Average Result:/)).toBeInTheDocument()

    const flaggedBox = screen.getByText(/Flagged Students:/).closest('div')
    expect(flaggedBox).toHaveTextContent('1')

    const totalBox = screen.getByText(/Total Students:/).closest('div')
    expect(totalBox).toHaveTextContent('3')

    expect(screen.getByText('Edit Results')).toBeInTheDocument()
    expect(screen.getByText('View Module Year Students')).toBeInTheDocument()
    expect(screen.getByText('Upload Results for Missing Data')).toBeInTheDocument()
  })

  test('renders fallback when no student data is available', () => {
    render(
      <MemoryRouter>
        <ModuleSummaryModuleYears moduleYear={moduleYearWithoutStudents} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year Start: 2023/)).toBeInTheDocument()
    expect(screen.getByText(/Semester: Autumn/)).toBeInTheDocument()
    expect(screen.getByText(/Module Co-ordinator: Dr. Bob Jones/)).toBeInTheDocument()
    expect(screen.getByText(/No student data available/)).toBeInTheDocument()
    expect(screen.getByText('Upload Students')).toBeInTheDocument()
    expect(screen.getByText('Upload Results for Missing Data')).toBeInTheDocument()
  })
})
