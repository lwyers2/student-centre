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
  return !!userModule
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

async function updateModuleYear(moduleId, moduleYearId, { coordinator, semester }) {

  const moduleYear = await ModuleYear.findOne({
    where: {
      id: moduleYearId,
      module_id: moduleId
    }
  })

  if (!moduleYear) {
    const error = new Error('Module year not found')
    error.status = 404
    throw error
  }
  if (!coordinator || !semester) {
    const error = new Error('Missing required fields')
    error.status = 400
    throw error
  }
  const coordinatorExists = await User.findOne({
    where: {
      id: coordinator
    }
  })
  if (!coordinatorExists) {
    const error = new Error('Coordinator not found')
    error.status = 404
    throw error
  }

  // I have to do the below because how I set up in the frontend...
  const isId = Number.isInteger(Number(semester))

  const whereCondition = isId ? { id: semester } : { name: semester }

  const semesterExists = await Semester.findOne({ where: whereCondition })

  if (!semesterExists) {
    const error = new Error('Semester not found')
    error.status = 404
    throw error
  }

  const [affectedCount] = await ModuleYear.update(
    {
      module_coordinator_id: coordinator,
      semester_id: semesterExists.id,
    },
    {
      where: {
        id: moduleYearId,
        module_id: moduleId
      }
    }
  )

  if (affectedCount === 0) {
    const error = new Error('Nothing to update')
    error.status = 404
    throw error
  }

  const updatedModuleYear = await ModuleYear.findOne({
    where: {
      id: moduleYearId,
      module_id: moduleId
    }
  })

  return updatedModuleYear
}

async function updateModule(moduleId, { title, code, year, CATs }) {
  const module = await Module.findOne({
    where: { id: moduleId }
  })

  if (!module) {
    const error = new Error('Module not found')
    error.status = 404
    throw error
  }

  const updatedModule = await module.update({
    title,
    code,
    year,
    CATs
  })

  return updatedModule
}

async function addUserToModule(userId, moduleYearId, moduleId) {

  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  const moduleYear = await ModuleYear.findOne({
    where: {
      id: moduleYearId,
      module_id: moduleId
    }
  })
  if (!moduleYear) {
    const error = new Error('Module year not found')
    error.status = 404
    throw error
  }
  const userModule = await UserModule.findOne({
    where: {
      user_id: userId,
      module_year_id: moduleYearId,
      module_id: moduleId
    }
  })
  if (userModule) {
    const error = new Error('User already in module year')
    error.status = 400
    throw error
  }

  const newUserModule = await UserModule.create({
    user_id: userId,
    module_year_id: moduleYearId,
    module_id:moduleId
  })

  const refactoredUserModule = await ModuleYear.findOne({
    where: {
      id: newUserModule.module_year_id,
    },
    include: [
      {
        model: Module,
        as: 'module_year_module',
        attributes: ['id', 'title', 'code', 'year', 'CATs'],
      },
      {
        model: User,
        as: 'module_year_module_coordinator',
        attributes: ['prefix', 'forename', 'surname']
      },
      {
        model: Semester,
        as: 'module_year_semester',
        attributes: ['id', 'name']
      },
    ]
  })

  const formatedModule = {
    CATs: refactoredUserModule.module_year_module.CATs,
    code: refactoredUserModule.module_year_module.code,
    module_coordinator: `${refactoredUserModule.module_year_module_coordinator.prefix}. ${refactoredUserModule.module_year_module_coordinator.forename} ${refactoredUserModule.module_year_module_coordinator.surname}`,
    module_year_id: refactoredUserModule.id,
    module_id: refactoredUserModule.module_year_module.id,
    semester: refactoredUserModule.module_year_semester.name,
    title: refactoredUserModule.module_year_module.title,
    year_start: refactoredUserModule.year_start,
    year: refactoredUserModule.module_year_module.year,
  }

  return formatedModule
}

async function removeUserFromModule(userId, moduleYearId, moduleId) {


  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  const moduleYear = await ModuleYear.findOne({
    where: {
      id: moduleYearId,
      module_id: moduleId
    }
  })
  if (!moduleYear) {
    const error = new Error('Module year not found')
    error.status = 404
    throw error
  }
  const userModule = await UserModule.findOne({
    where: {
      user_id: userId,
      module_year_id: moduleYearId,
      module_id: moduleId
    }
  })
  if (!userModule) {
    const error = new Error('User not in module year')
    error.status = 400
    throw error
  }

  const deleteUserModule = await UserModule.destroy({
    where: {
      user_id: userId,
      module_year_id: moduleYearId,
      module_id: moduleId
    }
  })

  return deleteUserModule
}


module.exports = {
  getAllModules,
  getModuleFromModuleYear,
  checkUserAccessToModule,
  getModule,
  getModulesFromCourseYear,
  updateModuleYear,
  updateModule,
  addUserToModule,
  removeUserFromModule,
}