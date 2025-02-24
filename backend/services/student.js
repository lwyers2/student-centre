const { Student, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse, StudentModule, StudentCourse } = require('../models')
const { formatAllStudentData } = require('../helper/formaters/student/formatAllStudentData')
const { formatStudentCourses } = require('../helper/formaters/student/formatStudentCourses')
const { formatStudentModules } = require('../helper/formaters/student/formatStudentModules')
const { formatOneStudentOneModuleYear } = require('../helper/formaters/student/formatOneStudentOneModuleYear')

async function getAllStudentData(studentId) {
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
    attributes: [], //'id','forename', 'surname', 'student_code', 'email'
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
  //return student
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

async function getStudentModuleData(studentId, moduleYearId) {

  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ['id', 'email', 'student_code', 'forename', 'surname'],
    include: [
      {
        model: ModuleYear,
        as: 'student_module_years',
        attributes: ['id', 'year_start', 'module_coordinator_id'],
        through: { attributes: ['result', 'resit', 'flagged'] },
        where: { id : moduleYearId },
        include: [
          {
            model: Semester,
            as: 'semester',
            attributes: ['name']
          },
          {
            model: User,
            as: 'module_co-ordinator',
            attributes: ['prefix', 'forename', 'surname']
          },
          {
            model: Module,
            as: 'module',
            attributes: ['title', 'id', 'code', 'CATs', 'year']
          }
        ]
      },
    ],

  })
  if (!student) {
    return null
  }

  return formatOneStudentOneModuleYear(student)
}

module.exports = {
  getAllStudentData,
  getStudentCoursesData,
  getStudentModulesData,
  getAllStudents,
  getStudentModuleData

}