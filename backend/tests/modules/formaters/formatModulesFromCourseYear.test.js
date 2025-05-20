const { formatModulesFromCourseYear } = require('../../../helper/formaters/module/formatModulesFromCourseYear') // adjust path as needed

describe('formatModulesFromCourseYear', () => {
  it('should format a list of module-course relationships correctly', () => {
    const mockModules = [
      {
        module_id: 1,
        module_year_id: 101,
        required: true,
        module_course_module_year: {
          year_start: 2024,
          module_year_semester: {
            name: 'Semester 1'
          }
        },
        module_course_module: {
          title: 'Quantum Physics',
          code: 'QP101',
          year: 1,
          CATs: '20'
        }
      },
      {
        module_id: 2,
        module_year_id: 102,
        required: false,
        module_course_module_year: {
          year_start: 2024,
          module_year_semester: {
            name: 'Semester 2'
          }
        },
        module_course_module: {
          title: 'Linear Algebra',
          code: 'LA201',
          year: 2,
          CATs: '40'
        }
      }
    ]

    const formatted = formatModulesFromCourseYear(mockModules)

    expect(formatted).toEqual([
      {
        module_id: 1,
        module_year_id: 101,
        required: true,
        year_start: 2024,
        semester: 'Semester 1',
        title: 'Quantum Physics',
        code: 'QP101',
        year: 1,
        CATs: '20'
      },
      {
        module_id: 2,
        module_year_id: 102,
        required: false,
        year_start: 2024,
        semester: 'Semester 2',
        title: 'Linear Algebra',
        code: 'LA201',
        year: 2,
        CATs: '40'
      }
    ])
  })

  it('should handle missing semester name', () => {
    const mockModules = [
      {
        module_id: 3,
        module_year_id: 103,
        required: true,
        module_course_module_year: {
          year_start: 2025,
          module_year_semester: null
        },
        module_course_module: {
          title: 'Calculus',
          code: 'CALC100',
          year: 1,
          CATs: '10'
        }
      }
    ]

    const formatted = formatModulesFromCourseYear(mockModules)

    expect(formatted).toEqual([
      {
        module_id: 3,
        module_year_id: 103,
        required: true,
        year_start: 2025,
        semester: undefined,
        title: 'Calculus',
        code: 'CALC100',
        year: 1,
        CATs: '10'
      }
    ])
  })
})
