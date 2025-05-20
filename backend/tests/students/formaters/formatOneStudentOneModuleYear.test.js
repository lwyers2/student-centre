const { formatOneStudentOneModuleYear } = require('../../../helper/formaters/student/formatOneStudentOneModuleYear')

describe('formatOneStudentOneModuleYear', () => {
  it('should correctly format student and module year data', () => {
    const mockStudent = {
      id: 1,
      email: 'student@qub.ac.uk',
      student_code: 'S12345',
      forename: 'Jane',
      surname: 'Smith',
      student_student_module: [
        {
          module_year_id: 101,
          result: 'Pass',
          flagged: false,
          resit: false,
          student_module_module_year: {
            year_start: 2024,
            module_year_semester: {
              name: 'Semester 1',
            },
            module_year_module_coordinator: {
              prefix: 'Dr',
              forename: 'John',
              surname: 'Doe',
            },
            module_year_module: {
              id: 201,
              title: 'Advanced Mathematics',
              code: 'MATH5001',
              CATs: 20,
              year: 2,
            },
          },
        },
      ],
    }

    const expectedOutput = {
      student: {
        id: 1,
        email: 'student@qub.ac.uk',
        student_code: 'S12345',
        forename: 'Jane',
        surname: 'Smith',
        letter_count_for_academic_year: undefined,
      },
      course: {
        id: undefined,
        course_year_id: undefined,
        year_start: undefined,
        year_end: undefined,
        title: undefined,
      },
      module: {
        module_year_id: 101,
        year_start: 2024,
        semester: 'Semester 1',
        module_coordinator: 'Dr. John Doe',
        title: 'Advanced Mathematics',
        module_id: 201,
        code: 'MATH5001',
        CATs: 20,
        year: 2,
        result: 'Pass',
        result_descriptor: undefined,
        flagged: false,
        resit: false,
      },
      letter: {},
    }

    const result = formatOneStudentOneModuleYear(mockStudent, undefined, undefined)
    expect(result).toEqual(expectedOutput)
  })

  it('should handle missing optional values gracefully', () => {
    const mockStudent = {
      id: 2,
      email: 'student2@qub.ac.uk',
      student_code: 'S67890',
      forename: 'Alice',
      surname: 'Johnson',
      student_student_module: [
        {
          module_year_id: 102,
          result: null,
          flagged: true,
          resit: true,
          student_module_module_year: {
            year_start: 2025,
            module_year_semester: null,
            module_year_module_coordinator: null,
            module_year_module: {
              id: 202,
              title: 'Physics 101',
              code: 'PHYS1001',
              CATs: 15,
              year: 1,
            },
          },
        },
      ],
    }

    const expectedOutput = {
      student: {
        id: 2,
        email: 'student2@qub.ac.uk',
        student_code: 'S67890',
        forename: 'Alice',
        surname: 'Johnson',
        letter_count_for_academic_year: undefined,
      },
      course: {
        id: undefined,
        course_year_id: undefined,
        year_start: undefined,
        year_end: undefined,
        title: undefined,
      },
      module: {
        module_year_id: 102,
        year_start: 2025,
        semester: undefined,
        module_coordinator: undefined,
        title: 'Physics 101',
        module_id: 202,
        code: 'PHYS1001',
        CATs: 15,
        year: 1,
        result: undefined,
        result_descriptor: undefined,
        flagged: true,
        resit: true,
      },
      letter: {},
    }

    const result = formatOneStudentOneModuleYear(mockStudent, undefined, undefined)
    expect(result).toEqual(expectedOutput)
  })

  it('should throw an error if no module data is provided', () => {
    const mockStudent = {
      id: 3,
      email: 'nomodule@qub.ac.uk',
      student_code: 'S99999',
      forename: 'Tom',
      surname: 'Harris',
      student_student_module: [],
    }

    expect(() => formatOneStudentOneModuleYear(mockStudent, undefined, undefined)).toThrow('Student module data is missing')
  })
})
