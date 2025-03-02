const { formatModuleYear } = require('../../../helper/formaters/module/formatModuleYear')

describe('formatModuleYear', () => {
  it('should correctly format module years', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 1,
          year_start: 2023,
          module_year_module: {
            id: 101,
            title: 'Advanced Mathematics',
            code: 'MATH3001',
            year: 3
          },
          module_year_semester: {
            name: 'Spring'
          },
          module_year_student_module: [
            {
              student_module_student: {
                student_code: 'S12345',
                id: 501,
                forename: 'Alice',
                surname: 'Johnson',
                email: 'alice@example.com'
              },
              result: 85,
              flagged: false,
              resit: false
            }
          ]
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(1)
    expect(formattedModuleYear.module[0].module_id).toBe(101)
    expect(formattedModuleYear.module[0].title).toBe('Advanced Mathematics')
    expect(formattedModuleYear.module[0].code).toBe('MATH3001')
    expect(formattedModuleYear.module[0].year).toBe(3)
    expect(formattedModuleYear.module[0].year_start).toBe(2023)
    expect(formattedModuleYear.module[0].semester).toBe('Spring')

    expect(formattedModuleYear.module[0].students).toHaveLength(1)
    expect(formattedModuleYear.module[0].students[0].student_code).toBe('S12345')
    expect(formattedModuleYear.module[0].students[0].id).toBe(501)
    expect(formattedModuleYear.module[0].students[0].forename).toBe('Alice')
    expect(formattedModuleYear.module[0].students[0].surname).toBe('Johnson')
    expect(formattedModuleYear.module[0].students[0].email).toBe('alice@example.com')
    expect(formattedModuleYear.module[0].students[0].result).toBe(85)
    expect(formattedModuleYear.module[0].students[0].flagged).toBe(false)
    expect(formattedModuleYear.module[0].students[0].resit).toBe(false)
  })

  it('should handle missing module_year_module gracefully', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 2,
          year_start: 2024,
          module_year_module: null,
          module_year_semester: { name: 'Autumn' },
          module_year_student_module: []
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_id).toBeUndefined()
    expect(formattedModuleYear.module[0].title).toBeUndefined()
    expect(formattedModuleYear.module[0].code).toBeUndefined()
    expect(formattedModuleYear.module[0].year).toBeUndefined()
    expect(formattedModuleYear.module[0].year_start).toBe(2024)
    expect(formattedModuleYear.module[0].semester).toBe('Autumn')
    expect(formattedModuleYear.module[0].students).toHaveLength(0)
  })

  it('should handle missing module_year_semester gracefully', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 3,
          year_start: 2022,
          module_year_module: {
            id: 103,
            title: 'Physics Fundamentals',
            code: 'PHYS1001',
            year: 1
          },
          module_year_semester: null,
          module_year_student_module: []
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_id).toBe(103)
    expect(formattedModuleYear.module[0].title).toBe('Physics Fundamentals')
    expect(formattedModuleYear.module[0].code).toBe('PHYS1001')
    expect(formattedModuleYear.module[0].year).toBe(1)
    expect(formattedModuleYear.module[0].year_start).toBe(2022)
    expect(formattedModuleYear.module[0].semester).toBeUndefined()
    expect(formattedModuleYear.module[0].students).toHaveLength(0)
  })

  it('should handle missing module_year_student_module gracefully', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 4,
          year_start: 2021,
          module_year_module: {
            id: 104,
            title: 'Computer Science Basics',
            code: 'CSCI1001',
            year: 1
          },
          module_year_semester: { name: 'Winter' },
          module_year_student_module: null
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_id).toBe(104)
    expect(formattedModuleYear.module[0].title).toBe('Computer Science Basics')
    expect(formattedModuleYear.module[0].code).toBe('CSCI1001')
    expect(formattedModuleYear.module[0].year).toBe(1)
    expect(formattedModuleYear.module[0].year_start).toBe(2021)
    expect(formattedModuleYear.module[0].semester).toBe('Winter')
    expect(formattedModuleYear.module[0].students).toHaveLength(0)
  })

  it('should return an empty array when no module years exist', () => {
    const mockModule = {
      module_module_year: []
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(0)
  })

})
