const { Student, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse, StudentModule, StudentCourse, Letter, LetterType, ResultDescriptor } = require('../models')
const { formatAllStudentData } = require('../helper/formaters/student/formatAllStudentData')
const { formatStudentCourses } = require('../helper/formaters/student/formatStudentCourses')
const { formatStudentModules } = require('../helper/formaters/student/formatStudentModules')
const { formatOneStudentOneModuleYear } = require('../helper/formaters/student/formatOneStudentOneModuleYear')
const { formatOneStudentOneModuleFromCourseYear } = require('../helper/formaters/student/formatOneStudentOneModuleFromCourseYear')

async function getAllStudents() {
  const students = await Student.findAll({
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
  })
  if (!students) {
    return null
  }
  return students
}

async function getOneStudentAllInfo(studentId) {
  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
    include: [
      {
        model: StudentModule,
        as: 'student_student_module',
        include: [
          {
            model: ModuleYear,
            as: 'student_module_module_year',
            include: [
              {
                model: Semester,
                as: 'module_year_semester',
                attributes: ['name']
              },
              {
                model: User,
                as: 'module_year_module_coordinator',
                attributes: ['id', 'prefix', 'forename', 'surname']
              },
              {
                model: Module,
                as: 'module_year_module'
              },
              {
                model: ModuleCourse,
                as: 'module_year_module_course'
              }
            ]
          },
          {
            model: ResultDescriptor,
            as: 'student_module_result_descriptor'
          }
        ],
      },
      {
        model: StudentCourse,
        as: 'student_student_course',
        include: [
          {
            model: CourseYear,
            as: 'student_course_course_year',
            include: [
              {
                model: Course,
                as: 'course_year_course',
                attributes: ['title', 'years', 'code', 'part_time'],
                include: [
                  {
                    model: QualificationLevel,
                    as: 'course_qualification_level',
                    attributes: ['qualification']
                  }
                ]
              },
              {
                model: User,
                as: 'course_year_course_coordinator',
                attributes: ['id', 'prefix', 'forename', 'surname']
              }
            ]
          }
        ]
      }
    ],
  })

  if (!student) return null

  return formatAllStudentData(student)
}

async function getStudentCoursesData(studentId) {
  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
    include: [
      {
        model: StudentCourse,
        as: 'student_student_course',
        include: [
          {
            model: CourseYear,
            as: 'student_course_course_year',
            include: [
              {
                model: Course,
                as: 'course_year_course',
                attributes: ['title', 'years', 'code', 'part_time'],
                include: [
                  {
                    model: QualificationLevel,
                    as: 'course_qualification_level',
                    attributes: ['qualification']
                  }
                ]
              },
              {
                model: User,
                as: 'course_year_course_coordinator',
                attributes: ['id', 'prefix', 'forename', 'surname']
              }
            ]
          }
        ]
      }
    ],
  })

  if (!student) return null

  return formatStudentCourses(student)
}

async function getStudentModulesData(studentId) {
  const student = await Student.findOne({
    where: { id: studentId },
    attributes: [],
    include: [
      {
        model: StudentModule,
        as: 'student_student_module',
        include: [
          {
            model: ModuleYear,
            as: 'student_module_module_year',
            include: [
              {
                model: Semester,
                as: 'module_year_semester',
                attributes: ['name']
              },
              {
                model: User,
                as: 'module_year_module_coordinator',
                attributes: ['id', 'prefix', 'forename', 'surname']
              },
              {
                model: Module,
                as: 'module_year_module'
              },
              {
                model: ModuleCourse,
                as: 'module_year_module_course'
              }
            ]
          },
          {
            model: ResultDescriptor,
            as: 'student_module_result_descriptor'
          }
        ],
      },
    ],
  })

  if (!student) return null

  return formatStudentModules(student)
}

async function getStudentModulesFromCourseYear(studentId, courseYearId) {
  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
    include: [
      {
        model: StudentCourse,
        as: 'student_student_course',
        where: { course_year_id: courseYearId },
        include: [
          {
            model: CourseYear,
            as: 'student_course_course_year',
            include: [
              {
                model: Course,
                as: 'course_year_course',
                attributes: ['title', 'years', 'code', 'part_time'],
                include: [
                  {
                    model: QualificationLevel,
                    as: 'course_qualification_level',
                    attributes: ['qualification']
                  }
                ]
              },
              {
                model: User,
                as: 'course_year_course_coordinator',
                attributes: ['id', 'prefix', 'forename', 'surname']
              },
              {
                model: ModuleCourse,
                as: 'course_year_module_course',
                where: { course_year_id: courseYearId },
                include:
                [
                  {
                    model: Module,
                    as: 'module_course_module',
                    include:
                    [
                      {
                        model: StudentModule,
                        as: 'module_student_module',
                        where: { student_id: studentId },
                        include: [
                          {
                            model: ResultDescriptor,
                            as: 'student_module_result_descriptor'
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
  })

  if (!student) return null

  return formatOneStudentOneModuleFromCourseYear(student)
  //return student
}



async function getStudentModuleYearData(studentId, moduleYearId) {

  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
    include: [
      {
        model: StudentModule,
        as: 'student_student_module',
        where: { module_year_id: moduleYearId },
        include: [
          {
            model: ModuleYear,
            as: 'student_module_module_year',
            include: [
              {
                model: Semester,
                as: 'module_year_semester',
                attributes: ['name']
              },
              {
                model: User,
                as: 'module_year_module_coordinator',
                attributes: ['id', 'prefix', 'forename', 'surname']
              },
              {
                model: Module,
                as: 'module_year_module'
              },
            ]
          },
          {
            model: Letter,
            as: 'student_module_letter',
            include: [
              {
                model: LetterType,
                as: 'letter_letter_type'
              },
              {
                model: User,
                as: 'letter_sent_by_user',
                attributes: ['prefix', 'forename', 'surname']
              },
              {
                model: User,
                as: 'letter_authorised_by_staff',
                attributes: ['prefix', 'forename', 'surname']
              },
            ]
          },
          {
            model: ResultDescriptor,
            as: 'student_module_result_descriptor'
          }
        ],
      },
    ],
  })
  const moduleYear = await ModuleYear.findByPk(moduleYearId, {
    include: {
      model: ModuleCourse,
      as: 'module_year_module_course',
      limit: 1,
    }
  })

  if (!moduleYear || !moduleYear.module_year_module_course.length) {
    throw new Error('ModuleYear or associated ModuleCourse not found')
  }

  const firstModuleCourse = moduleYear.module_year_module_course[0]

  const studentCourses = await StudentCourse.findAll({
    where: { course_year_id: firstModuleCourse.course_year_id }
  })

  if (!studentCourses.length) {
    throw new Error('No StudentCourse found for the given course_year_id')
  }

  const firstStudentCourse = studentCourses[0]

  const course = await CourseYear.findOne({
    where: { id: firstStudentCourse.course_year_id },
    include: {
      model: Course,
      as: 'course_year_course'
    }
  })


  if (!moduleYear || !moduleYear.module_year_module_course.length) {
    throw new Error(`Module year not found or not linked to a course year (ID: ${moduleYearId})`)
  }

  const courseYearId = moduleYear.module_year_module_course[0].course_year_id

  const moduleYearIds = await ModuleYear.findAll({
    where: { year_start: moduleYear.year_start },
    include: {
      model: ModuleCourse,
      as: 'module_year_module_course',
      where: { course_year_id: courseYearId },
    },
    attributes: ['id']
  }).then(moduleYears => moduleYears.map(m => m.id))

  if (!moduleYearIds.length) {
    throw new Error(`No module years found for course year ID: ${courseYearId}`)
  }

  const studentModuleIds = await StudentModule.findAll({
    where: {
      student_id: studentId,
      module_year_id: moduleYearIds
    },
    attributes: ['id']
  }).then(studentModules => studentModules.map(sm => sm.id))

  if (!studentModuleIds.length) {
    throw new Error(`No student modules found for student ID: ${studentId} in course year ID: ${courseYearId}`)
  }

  const letterCount = await Letter.count({
    where: { student_module_id: studentModuleIds }
  })


  if (!student) {
    return null
  }
  return formatOneStudentOneModuleYear(student, letterCount, course)
}

module.exports = {
  getOneStudentAllInfo,
  getStudentCoursesData,
  getStudentModulesData,
  getAllStudents,
  getStudentModuleYearData,
  getStudentModulesFromCourseYear

}