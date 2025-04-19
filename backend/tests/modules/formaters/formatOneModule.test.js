const { formatOneModule } = require('../../../helper/formaters/module/formatOneModule') // adjust path as needed

describe('formatOneModule', () => {
  it('should format a full module object correctly', () => {
    const mockModule = {
      id: 1,
      title: 'Quantum Logic',
      code: 'QL404',
      year: 4,
      CATs: '40',
      module_module_year: [
        {
          id: 10,
          year_start: 2024,
          module_year_semester: {
            name: 'Semester 2'
          },
          module_year_module_coordinator: {
            prefix: 'Dr',
            forename: 'Alice',
            surname: 'Wonderland'
          }
        },
        {
          id: 11,
          year_start: 2023,
          module_year_semester: {
            name: 'Semester 1'
          },
          module_year_module_coordinator: {
            prefix: 'Prof',
            forename: 'Bob',
            surname: 'Builder'
          }
        }
      ]
    }

    const formatted = formatOneModule(mockModule)

    expect(formatted).toEqual({
      module: {
        id: 1,
        title: 'Quantum Logic',
        code: 'QL404',
        year: 4,
        CATs: '40'
      },
      module_years: [
        {
          module_year_id: 10,
          year_start: 2024,
          semester: 'Semester 2',
          coordinator: 'Dr. Alice Wonderland'
        },
        {
          module_year_id: 11,
          year_start: 2023,
          semester: 'Semester 1',
          coordinator: 'Prof. Bob Builder'
        }
      ]
    })
  })

  it('should handle missing semester and coordinator gracefully', () => {
    const mockModule = {
      id: 2,
      title: 'Abstract Algebra',
      code: 'AA101',
      year: 1,
      CATs: '20',
      module_module_year: [
        {
          id: 12,
          year_start: 2025,
          module_year_semester: null,
          module_year_module_coordinator: null
        }
      ]
    }

    const formatted = formatOneModule(mockModule)

    expect(formatted).toEqual({
      module: {
        id: 2,
        title: 'Abstract Algebra',
        code: 'AA101',
        year: 1,
        CATs: '20'
      },
      module_years: [
        {
          module_year_id: 12,
          year_start: 2025,
          semester: undefined,
          coordinator: undefined
        }
      ]
    })
  })
})
