const { Student, Course, Module, User, ModuleYear, ModuleCourse, Semester, CourseYear, QualificationLevel, UserModule, StudentModule, ResultDescriptor } = require('../models')


async function getAllModules() {
  const modules = await Module.findAll({
    attributes: ['id', 'title', 'code', 'year', 'CATs'],
    include: [
      {
        model: ModuleYear,
        as: 'module_module_year',
        attributes: ['id', 'year_start', 'semester_id'],
        include: [
          {
            model: ModuleCourse,
            as: 'module_year_module_course',
            attributes: ['id'],
            include: [
              {
                model: Course,
                as: 'module_course_course',
                attributes: ['id', 'title', 'code', 'part_time', 'years'],
                include: [
                  {
                    model: CourseYear,
                    as: 'course_course_year',
                    attributes: ['id', 'year_start', 'year_end'],
                  },
                  {
                    model: QualificationLevel,
                    as: 'course_qualification_level',
                    attributes: ['qualification'],
                  }
                ]
              },
            ]
          },
          {
            model: User,
            as: 'module_year_module_coordinator',
            attributes: ['forename', 'surname']
          },
          {
            model: Semester,
            as: 'module_year_semester',
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
    attributes: [],
    include: [
      {
        model: ModuleYear,
        as: 'module_module_year',
        attributes: ['id', 'year_start', 'semester_id'],
        where: { id: moduleYearId },
        include: [
          {
            model: Module,
            as: 'module_year_module',
          },
          {
            model: Semester,
            as: 'module_year_semester',
            attributes: ['id', 'name']
          },
          {
            model: StudentModule,
            as: 'module_year_student_module',
            include: [
              {
                model: Student,
                as: 'student_module_student'
              },
              {
                model: ResultDescriptor,
                as: 'student_module_result_descriptor'
              }
            ]
          }
        ]
      },
    ]
  })
  if(!module) return null

  return (module)
}

async function checkUserAccessToModule(userId, moduleYearId) {
  const userModule = await UserModule.findOne({
    where: {
      user_id: userId,
      module_year_id: moduleYearId
    }
  })
  return !!userModule // Convert to boolean (true if found, false if not)
}


module.exports = {
  getAllModules,
  getModuleFromModuleYear,
  checkUserAccessToModule
}