import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ModuleYearsList from '../../../../components/ModuleView/Edit/ModuleYearsList'

jest.mock('../../../../services/module', () => ({
  updateModuleYear: jest.fn().mockResolvedValue({}),
}))

const mockModuleService = require('../../../../services/module')

const mockUser = { token: 'test-token' }

const mockUsers = [
  { id: 1, name: 'Dr. Alice' },
  { id: 2, name: 'Prof. Bob' },
]

const mockModuleYears = [
  {
    module_year_id: 101,
    year_start: 2023,
    coordinator: 'Dr. Alice',
    semester: 'Autumn',
  },
]

describe('<ModuleYearsList />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.alert = jest.fn() // silence alerts
  })

  test('renders module year information', () => {
    render(
      <ModuleYearsList
        moduleYears={mockModuleYears}
        setModuleYears={jest.fn()}
        users={mockUsers}
        user={mockUser}
        editingYears={{}}
        setEditingYears={jest.fn()}
        moduleId={1}
      />
    )

    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText(/Module Co-ordinator/i)).toBeInTheDocument()
    expect(screen.getByText(/Semester/i)).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  test('allows editing and saving of module year', async () => {
    const setModuleYears = jest.fn()
    const setEditingYears = jest.fn()

    const updatedYears = [
      {
        module_year_id: 101,
        year_start: 2023,
        coordinator: 2,
        semester: 'Spring',
      },
    ]

    render(
      <ModuleYearsList
        moduleYears={updatedYears}
        setModuleYears={setModuleYears}
        users={mockUsers}
        user={mockUser}
        editingYears={{ 101: true }}
        setEditingYears={setEditingYears}
        moduleId={1}
      />
    )

    fireEvent.change(screen.getByDisplayValue('Prof. Bob'), {
      target: { value: '2' },
    })

    fireEvent.change(screen.getByDisplayValue('Spring'), {
      target: { value: 'Spring' },
    })

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(mockModuleService.updateModuleYear).toHaveBeenCalledWith(
        'test-token',
        1,
        101,
        { coordinator: 2, semester: 'Spring' }
      )
    })

    expect(window.alert).toHaveBeenCalledWith('Updated!')
    expect(setEditingYears).toHaveBeenCalled()
  })

  test('can cancel editing', () => {
    const setEditingYears = jest.fn()

    render(
      <ModuleYearsList
        moduleYears={mockModuleYears}
        setModuleYears={jest.fn()}
        users={mockUsers}
        user={mockUser}
        editingYears={{ 101: true }}
        setEditingYears={setEditingYears}
        moduleId={1}
      />
    )

    fireEvent.click(screen.getByText('Cancel'))

    expect(setEditingYears).toHaveBeenCalledWith(expect.any(Function))
  })
})
