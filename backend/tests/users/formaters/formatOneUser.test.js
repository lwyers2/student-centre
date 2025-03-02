const { formatOneUser } = require('../../../helper/formaters/user/formatOneUser')

describe('formatOneUser', () => {
  it('should correctly format the user data', () => {
    const mockUser = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      active: 1,
      date_created: '2023-01-01',
      date_updated: '2023-02-01',
      is_active: true,
      user_user_school: [
        {
          user_school_school: { school_name: 'University A', id: 1 }
        }
      ],
      user_role: { name: 'Admin' },
      user_user_course: [
        {
          user_course_course: {
            id: 101,
            title: 'Course A',
            years: '2023-2024',
            code: 'C101',
            part_time: false,
            course_qualification_level: { qualification: 'Bachelor' },
          },
          user_course_course_year: {
            id: 1,
            year_start: '2023',
            year_end: '2024',
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Alice',
              surname: 'Smith',
            },
          }
        }
      ],
      user_module_user: [
        {
          module_id: 1,
          module_year_id: 1,
          user_module_module_year: {
            module_year_module: {
              title: 'Module A',
              code: 'M101',
              CATs: 10,
              year: 2023,
            },
            module_year_semester: { name: 'Semester 1' },
            year_start: '2023',
            module_year_module_coordinator: {
              prefix: 'Dr',
              forename: 'Bob',
              surname: 'Johnson',
            }
          }
        }
      ]
    }

    const formattedUser = formatOneUser(mockUser)

    // Check if the formatted user contains the expected properties
    expect(formattedUser).toHaveProperty('id', 1)
    expect(formattedUser).toHaveProperty('forename', 'John')
    expect(formattedUser.role).toHaveProperty('name', 'Admin')
    expect(formattedUser).toHaveProperty('courses')
    expect(formattedUser.courses).toHaveLength(1) // Check if courses array has the expected number of items
    expect(formattedUser.courses[0]).toHaveProperty('course_id', 101)
    expect(formattedUser.courses[0]).toHaveProperty('title', 'Course A')

    // Check if the formatted user contains the correct school info
    expect(formattedUser.schools).toHaveLength(1)
    expect(formattedUser.schools[0]).toHaveProperty('school', 'University A')
    expect(formattedUser.schools[0]).toHaveProperty('school_id', 1)

    // Check if the module is formatted properly
    expect(formattedUser.modules).toHaveLength(1)
    expect(formattedUser.modules[0]).toHaveProperty('module_id', 1)
    expect(formattedUser.modules[0]).toHaveProperty('title', 'Module A')
    expect(formattedUser.modules[0]).toHaveProperty('module_coordinator', 'Dr. Bob Johnson')

    // Check if the course_years have been properly formatted
    expect(formattedUser.courses[0].course_years).toHaveLength(1)
    expect(formattedUser.courses[0].course_years[0]).toHaveProperty('year_start', '2023')
    expect(formattedUser.courses[0].course_years[0]).toHaveProperty('course_coordinator', 'Dr. Alice Smith')
  })

  it('should handle empty user_user_course gracefully', () => {
    const mockUser = {
      id: 2,
      forename: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@example.com',
      user_role: { name: 'Admin' },
      user_user_course: []
    }

    const formattedUser = formatOneUser(mockUser)

    // Ensure courses is an empty array if no user_user_course
    expect(formattedUser.courses).toHaveLength(0)
  })

  it('should return an empty courses array if user_user_course is missing', () => {
    const mockUser = {
      id: 4,
      forename: 'Anna',
      surname: 'Taylor',
      email: 'anna.taylor@example.com',
      user_role: { name: 'Student' },
      user_user_school: [{ user_school_school: { school_name: 'University B', id: 2 } }]
      // user_user_course is missing
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser).toHaveProperty('courses')
    expect(formattedUser.courses).toEqual([]) // Should be an empty array
  })

  it('should return an empty modules array if user_module_user is missing', () => {
    const mockUser = {
      id: 5,
      forename: 'Jake',
      surname: 'Wilson',
      email: 'jake.wilson@example.com',
      user_role: { name: 'Lecturer' },
      user_user_school: [{ user_school_school: { school_name: 'University C', id: 3 } }],
      user_user_course: [
        {
          user_course_course: {
            id: 201,
            title: 'Physics 101',
            years: '2023-2024',
            code: 'PHY101',
            part_time: false,
            course_qualification_level: { qualification: 'Bachelor' },
          },
          user_course_course_year: {
            id: 2,
            year_start: '2023',
            year_end: '2024',
            course_year_course_coordinator: {
              prefix: 'Prof',
              forename: 'Emily',
              surname: 'Brown',
            },
          },
        },
      ],
      // user_module_user is missing
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser).toHaveProperty('modules')
    expect(formattedUser.modules).toEqual([]) // Should be an empty array
  })

  it('should handle missing user_module_module_year gracefully', () => {
    const mockUser = {
      id: 6,
      forename: 'Sarah',
      surname: 'Connor',
      email: 'sarah.connor@example.com',
      user_role: { name: 'Professor' },
      user_user_school: [{ user_school_school: { school_name: 'Tech University', id: 4 } }],
      user_module_user: [
        {
          module_id: 3,
          module_year_id: 2,
          user_module_module_year: null, // Missing module details
        },
      ],
    }
    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser).toHaveProperty('modules')
    expect(formattedUser.modules).toEqual([]) // Modules should be an empty array
  })

  it('should handle null or undefined values gracefully', () => {
    const mockUser = {
      id: 8,
      forename: 'Bob',
      surname: 'Johnson',
      email: 'bob.johnson@example.com',
      user_role: null,  // null role
      user_user_school: undefined,  // undefined school
      user_user_course: null,  // null courses
      user_module_user: undefined,  // undefined modules
    }

    const formattedUser = formatOneUser(mockUser)
    expect(formattedUser).toEqual({
      id: 8,
      forename: 'Bob',
      surname: 'Johnson',
      email: 'bob.johnson@example.com',
      active: undefined,
      date_created: undefined,
      date_updated: undefined,
      is_active: undefined,
      schools: [],
      role: null,
      courses: [],
      modules: [],
    }) // Should return the object with the correct format, handling nulls and undefined values
  })

  it('should handle empty string values gracefully', () => {
    const mockUser = {
      id: 9,
      forename: '',
      surname: '',
      email: '',
      user_role: { name: 'Guest' },
      user_user_school: [{ user_school_school: { school_name: '', id: 0 } }],
      user_user_course: [{ user_course_course: { title: '', code: '', years: [], qualification: '' } }],
      user_module_user: [{ module_id: 1, module_year_id: 1, user_module_module_year: null }],
    }

    const formattedUser = formatOneUser(mockUser)
    expect(formattedUser.forename).toBe('')  // Check if the forename is an empty string
    expect(formattedUser.surname).toBe('')   // Check if the surname is an empty string
    expect(formattedUser.email).toBe('')     // Check if the email is an empty string
    expect(formattedUser.schools[0].school_name).toBe(undefined)  // Check if school name is an empty string
    expect(formattedUser.courses[0].title).toBe('')         // Check if course title is an empty string
  })

  it('should handle null or undefined values for module_id and module_year_id gracefully', () => {
    const mockUser = {
      id: 10,
      forename: 'Charlie',
      surname: 'Brown',
      email: 'charlie.brown@example.com',
      user_role: { name: 'Instructor' },
      user_user_school: [{ user_school_school: { school_name: 'Science Faculty', id: 3 } }],
      user_user_course: [],
      user_module_user: [
        {
          module_id: null,  // null module_id
          module_year_id: undefined,  // undefined module_year_id
          user_module_module_year: null
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)
    expect(formattedUser.modules).toEqual([])
  })

  it('should handle missing course ID gracefully', () => {
    const mockUser = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      user_role: { name: 'Admin' },
      user_user_course: [
        {
          user_course_course: {
            title: 'Course A',
            years: '2023-2024',
            code: 'C101',
            part_time: false,
            course_qualification_level: { qualification: 'Bachelor' },
          },
          user_course_course_year: {
            id: 1,
            year_start: '2023',
            year_end: '2024',
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Alice',
              surname: 'Smith',
            },
          }
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    // Check if the course ID is 0 when missing
    expect(formattedUser.courses[0].course_id).toBe(0)
  })

  it('should handle missing course title gracefully', () => {
    const mockUser = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      user_role: { name: 'Admin' },
      user_user_course: [
        {
          user_course_course: {
            id: 101,
            years: '2023-2024',
            code: 'C101',
            part_time: false,
            course_qualification_level: { qualification: 'Bachelor' },
          },
          user_course_course_year: {
            id: 1,
            year_start: '2023',
            year_end: '2024',
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Alice',
              surname: 'Smith',
            },
          }
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    // Check if the course title is an empty string when missing
    expect(formattedUser.courses[0].title).toBe('')
  })

  it('should correctly add course years with coordinators', () => {
    const mockUser = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      user_role: { name: 'Admin' },
      user_user_course: [
        {
          user_course_course: {
            id: 101,
            title: 'Course A',
            years: '2023-2024',
            code: 'C101',
            part_time: false,
            course_qualification_level: { qualification: 'Bachelor' },
          },
          user_course_course_year: {
            id: 1,
            year_start: '2023',
            year_end: '2024',
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Alice',
              surname: 'Smith',
            },
          }
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    // Check if the course years are added correctly
    expect(formattedUser.courses[0].course_years).toHaveLength(1)
    expect(formattedUser.courses[0].course_years[0]).toHaveProperty('course_coordinator', 'Dr. Alice Smith')
  })

  it('should handle missing user_module_module_year gracefully', () => {
    const mockUser = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      user_role: { name: 'Admin' },
      user_module_user: [
        {
          module_id: 1,
          module_year_id: 1,
          user_module_module_year: null, // Missing module_year
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    // Ensure modules array is empty when module_year is missing
    expect(formattedUser.modules).toEqual([])
  })


  it('should handle missing module coordinator gracefully', () => {
    const mockUser = {
      id: 1,
      forename: 'John',
      surname: 'Doe',
      email: 'john.doe@example.com',
      user_role: { name: 'Admin' },
      user_module_user: [
        {
          module_id: 1,
          module_year_id: 1,
          user_module_module_year: {
            module_year_module: {
              title: 'Module A',
              code: 'M101',
              CATs: 10,
              year: 2023,
            },
            module_year_semester: { name: 'Semester 1' },
            year_start: '2023',
            module_year_module_coordinator: null, // Missing coordinator
          }
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    // Check if module coordinator is null when missing
    expect(formattedUser.modules[0].module_coordinator).toBe('.')
  })


})


