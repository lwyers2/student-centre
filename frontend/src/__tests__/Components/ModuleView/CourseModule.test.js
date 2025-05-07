import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CourseModule from '../../../components/ModuleView/CourseModule'

const mockModules = [
  {
    module_year_id: 1,
    title: 'Software Engineering',
    code: 'SE101',
    CATs: 20,
    semester: 'Autumn',
    module_coordinator: 'Dr. Alice Smith',
  },
  {
    module_year_id: 2,
    title: 'Data Structures',
    code: 'CS202',
    CATs: 15,
    semester: 'Spring',
    module_coordinator: 'Prof. Bob Jones',
  },
]

describe('<CourseModule />', () => {
  test('renders table with all modules by default', () => {
    render(
      <MemoryRouter>
        <CourseModule
          modules={mockModules}
          year_start="2023"
          year_end="2024"
          year="2023"
          search=""
          semester=""
          cats=""
          coordinator=""
        />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year: 2023 \(2023\/2024\)/)).toBeInTheDocument()
    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    expect(screen.getByText('CS202')).toBeInTheDocument()
  })

  test('filters by search term', () => {
    render(
      <MemoryRouter>
        <CourseModule
          modules={mockModules}
          year_start="2023"
          year_end="2024"
          year="2023"
          search="bob"
          semester=""
          cats=""
          coordinator=""
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(screen.queryByText('Software Engineering')).not.toBeInTheDocument()
  })

  test('filters by semester', () => {
    render(
      <MemoryRouter>
        <CourseModule
          modules={mockModules}
          year_start="2023"
          year_end="2024"
          year="2023"
          search=""
          semester="Autumn"
          cats=""
          coordinator=""
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument()
  })

  test('filters by CATs', () => {
    render(
      <MemoryRouter>
        <CourseModule
          modules={mockModules}
          year_start="2023"
          year_end="2024"
          year="2023"
          search=""
          semester=""
          cats="15"
          coordinator=""
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(screen.queryByText('Software Engineering')).not.toBeInTheDocument()
  })

  test('filters by coordinator', () => {
    render(
      <MemoryRouter>
        <CourseModule
          modules={mockModules}
          year_start="2023"
          year_end="2024"
          year="2023"
          search=""
          semester=""
          cats=""
          coordinator="Dr. Alice Smith"
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument()
  })

  test('returns null if no matches', () => {
    const { container } = render(
      <MemoryRouter>
        <CourseModule
          modules={mockModules}
          year_start="2023"
          year_end="2024"
          year="2023"
          search="notexist"
          semester=""
          cats=""
          coordinator=""
        />
      </MemoryRouter>
    )

    expect(container.firstChild).toBeNull()
  })
})
