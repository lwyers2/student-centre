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
              resit: false,
              student_module_result_descriptor: {
                descriptor: 'p',
                descriptor_id: 1
              },
            },
          ],

        }
      ]
    }

    console.log('Mock Module:', JSON.stringify(mockModule, null, 2))



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
  })

  it('should handle missing module_year_module gracefully', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 2,
          year_start: 2024,
          module_year_module: null, // module_year_module is null
          module_year_semester: { name: 'Autumn' },
          module_year_student_module: []
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(2)
    expect(formattedModuleYear.module[0].module_id).toBeUndefined() // Should be undefined since module_year_module is null
    expect(formattedModuleYear.module[0].title).toBeUndefined() // Should be undefined since module_year_module is null
    expect(formattedModuleYear.module[0].code).toBeUndefined() // Should be undefined since module_year_module is null
    expect(formattedModuleYear.module[0].year).toBeUndefined() // Should be undefined since module_year_module is null
    expect(formattedModuleYear.module[0].year_start).toBe(2024)
    expect(formattedModuleYear.module[0].semester).toBe('Autumn')
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students
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
          module_year_semester: null, // module_year_semester is null
          module_year_student_module: []
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(3)
    expect(formattedModuleYear.module[0].module_id).toBe(103)
    expect(formattedModuleYear.module[0].title).toBe('Physics Fundamentals')
    expect(formattedModuleYear.module[0].code).toBe('PHYS1001')
    expect(formattedModuleYear.module[0].year).toBe(1)
    expect(formattedModuleYear.module[0].year_start).toBe(2022)
    expect(formattedModuleYear.module[0].semester).toBeUndefined() // Should be undefined since module_year_semester is null
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students
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
          module_year_student_module: null // module_year_student_module is null
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(4)
    expect(formattedModuleYear.module[0].module_id).toBe(104)
    expect(formattedModuleYear.module[0].title).toBe('Computer Science Basics')
    expect(formattedModuleYear.module[0].code).toBe('CSCI1001')
    expect(formattedModuleYear.module[0].year).toBe(1)
    expect(formattedModuleYear.module[0].year_start).toBe(2021)
    expect(formattedModuleYear.module[0].semester).toBe('Winter')
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students (module_year_student_module is null)
  })

  it('should handle missing module_year_semester name gracefully', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 5,
          year_start: 2020,
          module_year_module: {
            id: 105,
            title: 'Introduction to Programming',
            code: 'CS1000',
            year: 1
          },
          module_year_semester: { name: null }, // Name is null
          module_year_student_module: []
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(5)
    expect(formattedModuleYear.module[0].module_id).toBe(105)
    expect(formattedModuleYear.module[0].title).toBe('Introduction to Programming')
    expect(formattedModuleYear.module[0].code).toBe('CS1000')
    expect(formattedModuleYear.module[0].year).toBe(1)
    expect(formattedModuleYear.module[0].year_start).toBe(2020)
    expect(formattedModuleYear.module[0].semester).toBeNull() // Should return null for semester when the name is null
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students
  })

  it('should return an empty array when no module years exist', () => {
    const mockModule = {
      module_module_year: []
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(0) // No module years
  })

  it('should return an empty array when module_module_year is not an array', () => {
    const mockModule = {
      module_module_year: null  // This will trigger the Array.isArray check to fail
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(0) // Should return an empty array
  })

  it('should handle module_year_module as null or missing', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 6,
          year_start: 2025,
          module_year_module: null, // module_year_module is null
          module_year_semester: { name: 'Summer' },
          module_year_student_module: [] // No students
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(6)
    expect(formattedModuleYear.module[0].module_id).toBeUndefined() // Should be undefined since module_year_module is null
    expect(formattedModuleYear.module[0].semester).toBe('Summer')
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students
  })

  it('should handle module_year_semester as null or missing', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 7,
          year_start: 2026,
          module_year_module: {
            id: 107,
            title: 'Data Science Fundamentals',
            code: 'DS101',
            year: 2
          },
          module_year_semester: null, // module_year_semester is null
          module_year_student_module: [] // No students
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(7)
    expect(formattedModuleYear.module[0].module_id).toBe(107)
    expect(formattedModuleYear.module[0].title).toBe('Data Science Fundamentals')
    expect(formattedModuleYear.module[0].semester).toBeUndefined() // Should be undefined since module_year_semester is null
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students
  })

  it('should handle module_year_student_module as null or missing', () => {
    const mockModule = {
      module_module_year: [
        {
          id: 8,
          year_start: 2027,
          module_year_module: {
            id: 108,
            title: 'Artificial Intelligence',
            code: 'AI200',
            year: 4
          },
          module_year_semester: { name: 'Fall' },
          module_year_student_module: null // module_year_student_module is null
        }
      ]
    }

    const formattedModuleYear = formatModuleYear(mockModule)

    expect(formattedModuleYear.module).toHaveLength(1)
    expect(formattedModuleYear.module[0].module_year_id).toBe(8)
    expect(formattedModuleYear.module[0].module_id).toBe(108)
    expect(formattedModuleYear.module[0].title).toBe('Artificial Intelligence')
    expect(formattedModuleYear.module[0].semester).toBe('Fall')
    expect(formattedModuleYear.module[0].students).toHaveLength(0) // No students (module_year_student_module is null)
  })
})
