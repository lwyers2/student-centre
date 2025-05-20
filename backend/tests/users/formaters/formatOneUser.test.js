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
          user_school_school: { school_name: 'School A', id: 1 }
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
            course_qualification_level: { qualification: 'BSC' },
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
            module_year_semester: { name: 'Spring' },
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

    expect(formattedUser).toHaveProperty('id', 1)
    expect(formattedUser).toHaveProperty('forename', 'John')
    expect(formattedUser.role).toHaveProperty('name', 'Admin')
    expect(formattedUser).toHaveProperty('courses')
    expect(formattedUser.courses).toHaveLength(1)
    expect(formattedUser.courses[0]).toHaveProperty('course_id', 101)
    expect(formattedUser.courses[0]).toHaveProperty('title', 'Course A')
    expect(formattedUser.schools).toHaveLength(1)
    expect(formattedUser.schools[0]).toHaveProperty('school', 'School A')
    expect(formattedUser.schools[0]).toHaveProperty('school_id', 1)
    expect(formattedUser.modules).toHaveLength(1)
    expect(formattedUser.modules[0]).toHaveProperty('module_id', 1)
    expect(formattedUser.modules[0]).toHaveProperty('title', 'Module A')
    expect(formattedUser.modules[0]).toHaveProperty('module_coordinator', 'Dr. Bob Johnson')
    expect(formattedUser.courses[0].course_years).toHaveLength(1)
    expect(formattedUser.courses[0].course_years[0]).toHaveProperty('year_start', '2023')
    expect(formattedUser.courses[0].course_years[0]).toHaveProperty('course_coordinator', 'Dr. Alice Smith')
  })

  it('should handle empty user_user_course ', () => {
    const mockUser = {
      id: 2,
      forename: 'Jane',
      surname: 'Smith',
      email: 'jane.smith@example.com',
      user_role: { name: 'Admin' },
      user_user_course: []
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser.courses).toHaveLength(0)
  })

  it('should return an empty courses array if user_user_course is missing', () => {
    const mockUser = {
      id: 4,
      forename: 'Anna',
      surname: 'Taylor',
      email: 'anna.taylor@example.com',
      user_role: { name: 'Student' },
      user_user_school: [{ user_school_school: { school_name: 'School B', id: 2 } }]
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser).toHaveProperty('courses')
    expect(formattedUser.courses).toEqual([])
  })

  it('should return an empty modules array if user_module_user is missing', () => {
    const mockUser = {
      id: 5,
      forename: 'Jake',
      surname: 'Wilson',
      email: 'jake.wilson@example.com',
      user_role: { name: 'Lecturer' },
      user_user_school: [{ user_school_school: { school_name: 'School C', id: 3 } }],
      user_user_course: [
        {
          user_course_course: {
            id: 201,
            title: 'Physics 101',
            years: '2023-2024',
            code: 'PHY101',
            part_time: false,
            course_qualification_level: { qualification: 'BSC' },
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
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser).toHaveProperty('modules')
    expect(formattedUser.modules).toEqual([])
  })

  it('should handle missing user_module_module_year ', () => {
    const mockUser = {
      id: 6,
      forename: 'Sarah',
      surname: 'Connor',
      email: 'sarah.connor@example.com',
      user_role: { name: 'Professor' },
      user_user_school: [{ user_school_school: { school_name: 'School Name', id: 4 } }],
      user_module_user: [
        {
          module_id: 3,
          module_year_id: 2,
          user_module_module_year: null,
        },
      ],
    }
    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser).toHaveProperty('modules')
    expect(formattedUser.modules).toEqual([])
  })

  it('should handle null or undefined values ', () => {
    const mockUser = {
      id: 8,
      forename: 'Bob',
      surname: 'Johnson',
      email: 'bob.johnson@example.com',
      user_role: null,
      user_user_school: undefined,
      user_user_course: null,
      user_module_user: undefined,
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
      job_title: '',
      prefix: '',
      schools: [],
      role: null,
      courses: [],
      modules: [],
    })
  })

  it('should handle empty string values ', () => {
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
    expect(formattedUser.forename).toBe('')
    expect(formattedUser.surname).toBe('')
    expect(formattedUser.email).toBe('')
    expect(formattedUser.schools[0].school_name).toBe(undefined)
    expect(formattedUser.courses[0].title).toBe('')
  })

  it('should handle null or undefined values for module_id and module_year_id ', () => {
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
          module_id: null,
          module_year_id: undefined,
          user_module_module_year: null
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)
    expect(formattedUser.modules).toEqual([])
  })

  it('should handle missing course ID ', () => {
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
            course_qualification_level: { qualification: 'BSC' },
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

    expect(formattedUser.courses[0].course_id).toBe(0)
  })

  it('should handle missing course title ', () => {
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
            course_qualification_level: { qualification: 'BSC' },
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
            course_qualification_level: { qualification: 'BSC' },
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

    expect(formattedUser.courses[0].course_years).toHaveLength(1)
    expect(formattedUser.courses[0].course_years[0]).toHaveProperty('course_coordinator', 'Dr. Alice Smith')
  })

  it('should handle missing user_module_module_year ', () => {
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
          user_module_module_year: null,
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser.modules).toEqual([])
  })


  it('should handle missing module coordinator ', () => {
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
            module_year_semester: { name: 'Spring' },
            year_start: '2023',
            module_year_module_coordinator: null,
          }
        }
      ],
    }

    const formattedUser = formatOneUser(mockUser)

    expect(formattedUser.modules[0].module_coordinator).toBe('.')
  })


})


