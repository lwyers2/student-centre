import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Module from '../../../../components/Edit/Module/Module'

const mockModules = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    CATs: 15,
    year: 1,
  },
  {
    id: 2,
    code: 'MATH204',
    title: 'Advanced Mathematics',
    CATs: 30,
    year: 2,
  },
]

describe('<Module /> - ModuleList view', () => {
  test('renders all modules with correct info', () => {
    render(
      <MemoryRouter>
        <Module modules={mockModules} />
      </MemoryRouter>
    )

    expect(screen.getByText('All Modules')).toBeInTheDocument()
    expect(screen.getByText('CS101')).toBeInTheDocument()
    expect(screen.getByText('Advanced Mathematics')).toBeInTheDocument()
    expect(screen.getAllByText(/View/i)).toHaveLength(2)
  })

  test('renders table headers', () => {
    render(
      <MemoryRouter>
        <Module modules={mockModules} />
      </MemoryRouter>
    )

    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('CATs')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()
  })

  test('renders table even if modules array is empty', () => {
    render(
      <MemoryRouter>
        <Module modules={[]} />
      </MemoryRouter>
    )

    expect(screen.getByText('All Modules')).toBeInTheDocument()
    const tableBody = screen.getByRole('table').querySelector('tbody')
    expect(tableBody?.children.length).toBe(0) // No data rows
  })
})
