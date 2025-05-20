const { formatUsersCourseYear } = require('../../../helper/formaters/user/formatUsersCourseYear')

describe('formatUsersCourseYear', () => {
  it('should correctly format user and course details', () => {
    const mockUser = {
      id: 1,
      prefix: 'Dr',
      forename: 'John',
      surname: 'Doe',
      user_user_course: [
        {
          user_course_course: {
            id: 101,
            title: 'Computer Science',
            code: 'CS101',
            years: [2021, 2022, 2023],
            part_time: false,
            course_qualification_level: {
              qualification: 'BCS'
            }
          },
          user_course_course_year: {
            id: 1001,
            year_start: 2021,
            year_end: 2024,
            course_year_course_coordinator: {
              prefix: 'Prof',
              forename: 'Alice',
              surname: 'Smith'
            }
          }
        },
        {
          user_course_course: {
            id: 102,
            title: 'Mathematics',
            code: 'MATH101',
            years: [2022, 2023],
            part_time: true,
            course_qualification_level: {
              qualification: 'MCS'
            }
          },
          user_course_course_year: {
            id: 1002,
            year_start: 2022,
            year_end: 2025,
            course_year_course_coordinator: {
              prefix: 'Dr',
              forename: 'Bob',
              surname: 'Jones'
            }
          }
        }
      ]
    }

    const formattedUser = formatUsersCourseYear(mockUser)

    expect(formattedUser.user.id).toBe(1)
    expect(formattedUser.user.prefix).toBe('Dr')
    expect(formattedUser.user.forename).toBe('John')
    expect(formattedUser.user.surname).toBe('Doe')

    expect(formattedUser.user.courses).toHaveLength(2)

    const firstCourse = formattedUser.user.courses[0]
    expect(firstCourse.course_id).toBe(101)
    expect(firstCourse.title).toBe('Computer Science')
    expect(firstCourse.code).toBe('CS101')
    expect(firstCourse.years).toEqual([2021, 2022, 2023])
    expect(firstCourse.part_time).toBe(false)
    expect(firstCourse.qualification).toBe('BCS')
    expect(firstCourse.course_years).toHaveLength(1)

    const firstCourseYear = firstCourse.course_years[0]
    expect(firstCourseYear.id).toBe(1001)
    expect(firstCourseYear.year_start).toBe(2021)
    expect(firstCourseYear.year_end).toBe(2024)
    expect(firstCourseYear.course_coordinator).toBe('Prof. Alice Smith')

    const secondCourse = formattedUser.user.courses[1]
    expect(secondCourse.course_id).toBe(102)
    expect(secondCourse.title).toBe('Mathematics')
    expect(secondCourse.code).toBe('MATH101')
    expect(secondCourse.years).toEqual([2022, 2023])
    expect(secondCourse.part_time).toBe(true)
    expect(secondCourse.qualification).toBe('MCS')
    expect(secondCourse.course_years).toHaveLength(1)

    const secondCourseYear = secondCourse.course_years[0]
    expect(secondCourseYear.id).toBe(1002)
    expect(secondCourseYear.year_start).toBe(2022)
    expect(secondCourseYear.year_end).toBe(2025)
    expect(secondCourseYear.course_coordinator).toBe('Dr. Bob Jones')
  })

  it('should handle missing course information', () => {
    const mockUser = {
      id: 2,
      prefix: 'Ms',
      forename: 'Jane',
      surname: 'Smith',
      user_user_course: [
        {
          user_course_course: {
            id: 103,
            title: 'Physics',
            code: 'PHYS101',
            years: [2021],
            part_time: false,
            course_qualification_level: {
              qualification: 'BCS'
            }
          },
          user_course_course_year: {}
        }
      ]
    }

    const formattedUser = formatUsersCourseYear(mockUser)

    expect(formattedUser.user.id).toBe(2)
    expect(formattedUser.user.prefix).toBe('Ms')
    expect(formattedUser.user.forename).toBe('Jane')
    expect(formattedUser.user.surname).toBe('Smith')

    expect(formattedUser.user.courses).toHaveLength(1)

    const course = formattedUser.user.courses[0]
    expect(course.course_id).toBe(103)
    expect(course.title).toBe('Physics')
    expect(course.code).toBe('PHYS101')
    expect(course.years).toEqual([2021])
    expect(course.part_time).toBe(false)
    expect(course.qualification).toBe('BCS')
    expect(course.course_years).toHaveLength(1)

    const courseYear = course.course_years[0]
    expect(courseYear.id).toBeUndefined()
    expect(courseYear.year_start).toBeUndefined()
    expect(courseYear.year_end).toBeUndefined()
    expect(courseYear.course_coordinator).toBeUndefined()
  })

  it('should handle missing user_user_course ', () => {
    const mockUser = {
      id: 3,
      prefix: 'Dr',
      forename: 'George',
      surname: 'Williams',
      user_user_course: []
    }

    const formattedUser = formatUsersCourseYear(mockUser)

    expect(formattedUser.user.courses).toHaveLength(0)
  })


})
