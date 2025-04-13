const { Student, Course, Module, User, ModuleYear, ModuleCourse, Semester, CourseYear, QualificationLevel, UserModule, StudentModule, ResultDescriptor } = require('../models')
const { formatOneModule } = require('../helper/formaters/module/formatOneModule')
const { formatModulesFromCourseYear } = require('../helper/formaters/module/formatModulesFromCourseYear')

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


async function getModule(moduleId) {
  const module = await Module.findOne({
    where: { id: moduleId },
    attributes: ['id', 'title', 'code', 'year', 'CATs'],
    include: [
      {
        model: ModuleYear,
        as: 'module_module_year',
        attributes: ['id', 'year_start', 'semester_id'],
        include: [
          {
            model: User,
            as: 'module_year_module_coordinator',
            attributes: ['forename', 'surname', 'prefix']
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
  if(!module) return null

  return formatOneModule(module)

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


async function getModulesFromCourseYear(courseYearId) {
  const modules = await ModuleCourse.findAll({
    where: { course_year_id: courseYearId },
    include: [
      {
        model: ModuleYear,
        as: 'module_course_module_year',
        attributes: ['id', 'year_start', ],
        include: [
          {
            model: Semester,
            as: 'module_year_semester',
            attributes: ['id', 'name']
          },
        ],
      },
      {
        model: Module,
        as: 'module_course_module',
        attributes: ['id', 'title', 'code', 'year', 'CATs'],
      }
    ],
  })
  if(!modules) return null

  return formatModulesFromCourseYear(modules)
}

module.exports = {
  getAllModules,
  getModuleFromModuleYear,
  checkUserAccessToModule,
  getModule,
  getModulesFromCourseYear
}