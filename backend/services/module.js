const { Student, Course, Module, User, ModuleYear, ModuleCourse, Semester, CourseYear, QualificationLevel } = require('../models')

async function getAllModules() {
  const modules = await Module.findAll({
    attributes: ['id', 'title', 'code', 'year', 'CATs'],
    include: [
      {
        model: ModuleYear,
        as: 'module_years',
        attributes: ['id', 'year_start', 'semester_id'],
        include: [
          {
            model: ModuleCourse,
            as: 'module_courses',
            attributes: ['id'],
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['id', 'title', 'code', 'part_time', 'years'],
                include: [
                  {
                    model: CourseYear,
                    as: 'course_years',
                    attributes: ['id', 'year_start', 'year_end'],
                  },
                  {
                    model: QualificationLevel,
                    as: 'qualification_level',
                    attributes: ['qualification'],
                  }
                ]
              },
            ]
          },
          {
            model: User,
            as: 'module_co-ordinator',
            attributes: ['forename', 'surname']
          },
          {
            model: Semester,
            as: 'semester',
            attributes: ['id', 'name']
          },
        ],
      },
    ],
  })
  if(!modules) {
    return null
  }

  return modules
}


async function getModuleFromModuleYear(moduleYearId) {
  const module = await Module.findOne({
    attributes: ['id', 'title', 'code', 'CATs', 'year'],
    include: [
      {
        model: ModuleYear,
        as: 'module_years',
        attributes: ['id', 'year_start', 'semester_id'],
        where: { id: moduleYearId },
        include: [
          {
            model: Semester,
            as: 'semester',
            attributes: ['id', 'name']
          }
        ]
      },
      {
        model: Student,
        as: 'module_students',
        attributes: ['id', 'forename', 'surname', 'email', 'student_code'],
        through: {
          attributes: ['result', 'resit', 'flagged'], // Include extra attributes from the join table if needed
          where: { module_year_id: moduleYearId }, // Apply filter to the join table, not directly on Student
        }
      },
      {
        model: User,
        as: 'users',
        attributes: ['id']
      }
    ]
  })
  if(!module) return null

  return (module)
}

module.exports = {
  getAllModules,
  getModuleFromModuleYear
}