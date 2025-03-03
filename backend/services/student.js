const { Student, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse, StudentModule, StudentCourse } = require('../models')
const { formatAllStudentData } = require('../helper/formaters/student/formatAllStudentData')
const { formatStudentCourses } = require('../helper/formaters/student/formatStudentCourses')
const { formatStudentModules } = require('../helper/formaters/student/formatStudentModules')
const { formatOneStudentOneModuleYear } = require('../helper/formaters/student/formatOneStudentOneModuleYear')

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
  //return student
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
  //return student
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
          }
        ],
      },
    ],
  })

  if (!student) return null

  return formatStudentModules(student)
}

async function getAllStudents() {

  const students = await Student.findAll({
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
  })


  if (!students) {
    return null
  }

  return students

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
          }
        ],
      },
    ],
  })
  if (!student) {
    return null
  }
  return formatOneStudentOneModuleYear(student)
}

module.exports = {
  getOneStudentAllInfo,
  getStudentCoursesData,
  getStudentModulesData,
  getAllStudents,
  getStudentModuleYearData

}