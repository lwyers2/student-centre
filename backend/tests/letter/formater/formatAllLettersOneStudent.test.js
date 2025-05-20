const { formatAllLettersOneStudent } = require('../../../helper/formaters/letter/formatAllLettersOneStudent') // adjust path as needed

describe('formatAllLettersOneStudent', () => {
  it('should correctly format a nested letter object', () => {
    const mockLetters = [
      {
        id: 1,
        date_sent: '2024-04-01',
        authorised: true,
        letter_sent_by_user: {
          prefix: 'Dr',
          forename: 'Alice',
          surname: 'Smith'
        },
        letter_authorised_by_staff: {
          prefix: 'Prof',
          forename: 'Bob',
          surname: 'Jones'
        },
        letter_letter_type: {
          name: 'Warning'
        },
        letter_student_module: {
          module_id: 101,
          result: 58,
          flagged: false,
          module_year_id: 501,
          student_module_module: {
            title: 'Computing Foundations',
            year: 2023,
            code: 'TEST301'
          },
          student_module_module_year: {
            year_start: '2023-09-01'
          },
          student_module_result_descriptor: {
            descriptor: 'Pass'
          },
          student_module_student: {
            id: 7,
            forename: 'Student',
            surname: 'Name',
            email: 'student.name@qub.ac.uk',
            student_code: 'B007'
          }
        }
      }
    ]

    const result = formatAllLettersOneStudent(mockLetters)

    expect(result).toEqual([
      {
        id: 1,
        date_sent: '2024-04-01',
        authorised: true,
        sent_by: 'Dr Alice Smith',
        authorised_by: 'Prof Bob Jones',
        type: 'Warning',
        module: {
          id: 101,
          result: 58,
          flagged: false,
          module_year_id: 501,
          title: 'Computing Foundations',
          year: 2023,
          code: 'TEST301',
          year_start: '2023-09-01',
          result_descriptor: 'Pass'
        },
        student: {
          id: 7,
          name: 'Student Name',
          email: 'student.name@qub.ac.uk',
          student_code: 'B007'
        }
      }
    ])
  })
})
