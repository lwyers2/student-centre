const { Student, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse } = require('../models')
const { formatStudentData } = require('../helper/formaters/formatStudentData')
async function getAllStudentData(studentId) {
  const student = await Student.findOne({
    where: { id: studentId },
    attributes: ['id','forename', 'surname', 'student_code', 'email'],
    include: [
      {
        model: ModuleYear,
        as: 'student_module_years',
        attributes: ['id', 'year_start', 'module_coordinator_id'],
        through: { attributes: ['result', 'resit', 'flagged'] },
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
          },
          {
            model: ModuleCourse,
            as: 'module_courses',
            attributes: ['course_year_id'],
          }
        ]
      },
      {
        model: CourseYear,
        as: 'student_course_years',
        attributes: ['id', 'year_start', 'year_end'],
        include: [
          {
            model: Course,
            as: 'course',
            attributes: ['id','title', 'years', 'code', 'part_time'],
            include: [
              {
                model: QualificationLevel,
                as: 'qualification_level',
                attributes: ['qualification'],
              },
            ],
          },
          {
            model: User,
            as: 'course_co-ordinator',
            attributes: ['forename', 'surname']
          }
        ],
      },
    ],
    //logging: console.log,
  })

  if (!student) return null

  // return formatStudentData(student); // Separate function for transformation
  return formatStudentData(student)
}

module.exports = { getAllStudentData }