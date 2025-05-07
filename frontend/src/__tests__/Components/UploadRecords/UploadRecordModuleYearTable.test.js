import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import UploadRecordsModules from '../../../components/UploadRecords/UploadRecordModuleYearTable'

const mockModules = [
  {
    module_year_id: 1,
    title: 'Algorithms',
    code: 'CS201',
    module_coordinator: 'Dr. Jane Smith',
    CATs: 20,
    semester: 'Autumn',
  },
  {
    module_year_id: 2,
    title: 'Operating Systems',
    code: 'CS301',
    module_coordinator: 'Prof. John Doe',
    CATs: 15,
    semester: 'Spring',
  }
]

const props = {
  modules: mockModules,
  year_start: 2023,
  year_end: 2024,
  year: '2023',
  search: '',
}

describe('<UploadRecordsModules />', () => {
  test('renders academic year and module data correctly', () => {
    render(
      <MemoryRouter>
        <UploadRecordsModules {...props} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year: 2023 \(2023\/2024\)/)).toBeInTheDocument()
    expect(screen.getByText('Algorithms')).toBeInTheDocument()
    expect(screen.getByText('Operating Systems')).toBeInTheDocument()
    expect(screen.getByText('CS201')).toBeInTheDocument()
    expect(screen.getByText('CS301')).toBeInTheDocument()
    expect(screen.getAllByText('View')).toHaveLength(2)
  })

  test('filters module by search', () => {
    render(
      <MemoryRouter>
        <UploadRecordsModules {...props} search="algorithms" />
      </MemoryRouter>
    )

    expect(screen.getByText('Algorithms')).toBeInTheDocument()
    expect(screen.queryByText('Operating Systems')).not.toBeInTheDocument()
  })

  test('renders no rows if no match found', () => {
    const { container } = render(
      <MemoryRouter>
        <UploadRecordsModules {...props} search="nonexistent" />
      </MemoryRouter>
    )

    expect(container.querySelector('tbody')?.textContent).toBe('')
  })
})
