import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AllModules from '../../../components/ModuleView/AllModules'

const mockModules = [
  {
    module_id: 1,
    title: 'Software Engineering',
    code: 'SE101',
    CATs: 20,
  },
  {
    module_id: 2,
    title: 'Data Structures',
    code: 'CS202',
    CATs: 15,
  },
]

describe('<AllModules />', () => {
  test('renders all modules by default', () => {
    render(
      <MemoryRouter>
        <AllModules modules={mockModules} year="2024" search="" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year: 2024/i)).toBeInTheDocument()
    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    expect(screen.getByText('SE101')).toBeInTheDocument()
    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(screen.getByText('CS202')).toBeInTheDocument()
  })

  test('filters modules by title', () => {
    render(
      <MemoryRouter>
        <AllModules modules={mockModules} year="2024" search="software" />
      </MemoryRouter>
    )

    expect(screen.getByText('Software Engineering')).toBeInTheDocument()
    expect(screen.queryByText('Data Structures')).not.toBeInTheDocument()
  })

  test('filters modules by code', () => {
    render(
      <MemoryRouter>
        <AllModules modules={mockModules} year="2024" search="cs202" />
      </MemoryRouter>
    )

    expect(screen.getByText('Data Structures')).toBeInTheDocument()
    expect(screen.queryByText('Software Engineering')).not.toBeInTheDocument()
  })

  test('renders table even if no matches found', () => {
    const { container } = render(
      <MemoryRouter>
        <AllModules modules={mockModules} year="2024" search="nonexistent" />
      </MemoryRouter>
    )

    expect(screen.getByText(/Academic Year: 2024/i)).toBeInTheDocument()
    // The table still exists, but no data rows will show
    expect(container.querySelector('tbody')?.textContent).toBe('')
  })
})
