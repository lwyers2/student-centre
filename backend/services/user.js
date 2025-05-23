const { UserModule, UserCourse, School, UserSchool, Role, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse, StudentModule, Student, ResultDescriptor } = require('../models')
const { formatAllUsers } = require('../helper/formaters/user/formatAllUsers')
const { formatUserModulesFromCourseYear } = require('../helper/formaters/user/formatUserModulesFromCourseYear')
const { formatUsersCourseYear } = require('../helper/formaters/user/formatUsersCourseYear')
const { formatOneUser } = require('../helper/formaters/user/formatOneUser')
const { formatUserModules } = require('../helper/formaters/user/formatUserModules')
const { formatUserStudents } = require('../helper/formaters/user/formatUserStudents')
const { formatOneUserOneModule } = require('../helper/formaters/user/formatOneUserOneModule')
const { formatUsersFromCourseYears } = require('../helper/formaters/user/formatUsersFromCourseYear')
const { formatUsersFromSchool } = require('../helper/formaters/user/formatUsersFromSchool')
const { formatUsersFromModule } = require('../helper/formaters/user/formatUsersFromModule')
const { formatUserDetails } = require('../helper/formaters/user/formatUserDetails')
const bcrypt = require('bcrypt')

async function getAllUsers() {
  const users = await User.findAll({
    attributes: ['id', 'prefix', 'forename', 'surname', 'email', 'active', 'date_created', 'date_updated'],
    include: [
      {
        model: UserSchool,
        as: 'user_user_school',
        required: true,
        include: [
          {
            model: School,
            as: 'user_school_school'
          }
        ]
      },
      {
        model: Role,
        as: 'user_role',
        required: true,
      },
    ],
  })
  if(!users) return null

  return formatAllUsers(users)
  //return users
}

async function getUser(userId) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix','forename', 'surname', 'email', 'active', 'date_created', 'date_updated', 'job_title'],
    include: [
      {
        model: UserSchool,
        as: 'user_user_school',
        include: [
          {
            model: School,
            as: 'user_school_school'
          }
        ],
        required: true,
      },
      {
        model: Role,
        as: 'user_role',
        required: true,
      },
      {
        model: UserCourse,
        as: 'user_user_course',
        attributes: ['id'],
        include: [
          {
            model: CourseYear,
            as: 'user_course_course_year',
            attributes: ['id', 'year_start', 'year_end'],
            include: [
              {
                model: User,
                attributes: ['prefix','forename', 'surname'],
                as: 'course_year_course_coordinator'
              }
            ]
          },
          {
            model: Course,
            as: 'user_course_course',
            attributes: ['id', 'title', 'years', 'code', 'part_time'],
            include: [
              {
                model: QualificationLevel,
                as: 'course_qualification_level',
                attributes: ['qualification'],
              },
            ]
          },
        ]
      },
      {
        model: UserModule,
        as: 'user_module_user',
        include:
        [
          {
            model: ModuleYear,
            as: 'user_module_module_year',
            attributes: ['id', 'year_start', 'module_id'],
            required: true,
            include:
            [
              {
                model: User,
                as: 'module_year_module_coordinator',
                attributes: ['prefix', 'forename', 'surname']
              },
              {
                model: Semester,
                as: 'module_year_semester',

              },
              {
                model: ModuleCourse,
                as: 'module_year_module_course',
              },
              {
                model: Module,
                as: 'module_year_module',
                attributes: ['id','title','year','code','CATs']
              },
            ]
          }
        ]
      }
    ],
  })
  return formatOneUser(user)
  //return user
}

async function getOneUserDetails(userId) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix','forename', 'surname', 'email', 'active', 'date_created', 'date_updated', 'job_title'],
    include: [
      {
        model: UserSchool,
        as: 'user_user_school',
        include: [
          {
            model: School,
            as: 'user_school_school'
          }
        ],
        required: true,
      },
      {
        model: Role,
        as: 'user_role',
        required: true,
      },
    ],
  })
  if(!user) return null
  return formatUserDetails(user)
}


async function getUserCourses(userId) {

  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix', 'forename', 'surname'],
    include: [
      {
        model: UserCourse,
        as: 'user_user_course',
        attributes: ['id'],
        include: [
          {
            model: CourseYear,
            as: 'user_course_course_year',
            attributes: ['id', 'year_start', 'year_end'],
            include: [
              {
                model: User,
                attributes: ['prefix','forename', 'surname'],
                as: 'course_year_course_coordinator'
              }
            ]
          },
          {
            model: Course,
            as: 'user_course_course',
            attributes: ['id', 'title', 'years', 'code', 'part_time'],
            include: [
              {
                model: QualificationLevel,
                as: 'course_qualification_level',
                attributes: ['qualification'],
              },
            ]
          },
        ]
      }
    ],
  })

  if(!user) return null

  return formatUsersCourseYear(user)
}

const createUser = async ({ forename, surname, email, password, active,  role_id, job_title, prefix }) => {

  if (!forename || !surname || !email || !password || !role_id) {
    const error = new Error('Missing required fields')
    error.status = 400
    throw error
  }

  const role = await Role.findOne({ where: { id: role_id } })
  if (!role) {
    const error = new Error('Role not found')
    error.status = 400
    throw error
  }

  //hash password
  const passwordHash = await bcrypt.hash(password, 10)

  return await User.create({
    forename,
    surname,
    email,
    password: passwordHash,
    date_created: new Date(),
    date_updated: new Date(),
    active: active ?? true,
    role_id: role.id,
    job_title: job_title,
    prefix,
  })
}

async function getUserModules(userId) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix', 'forename', 'surname'],
    include: [
      {
        model: UserModule,
        as: 'user_module_user',
        //attributes: [],
        include:
        [
          {
            model: Module,
            as: 'user_modules_module',
            attributes: ['id','title','year','code','CATs'],
            include: [
              {
                model: ModuleCourse,
                as: 'module_module_course'
              }
            ]
          },
        ]
      },
      {
        model: UserCourse,
        as: 'user_user_course',
        include: [
          {
            model: Course,
            as: 'user_course_course',
            include: [
              {
                model: QualificationLevel,
                as: 'course_qualification_level'
              }
            ]
          },
          {
            model: CourseYear,
            as: 'user_course_course_year',
          }
        ]
      }
    ],
  })
  if(!user) return null

  return formatUserModules(user)

}


async function getUserModulesFromCourseYear(userId, courseYearId) {

  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix', 'forename', 'surname'],
    include: [
      {
        model: UserModule,
        as: 'user_module_user',
        //attributes: [],
        include:
        [
          {
            model: ModuleYear,
            as: 'user_module_module_year',
            attributes: ['id', 'year_start', 'module_id'],
            required: true,
            include:
            [
              {
                model: User,
                as: 'module_year_module_coordinator',
                attributes: ['prefix', 'forename', 'surname']
              },
              {
                model: Semester,
                as: 'module_year_semester',

              },
              {
                model: ModuleCourse,
                as: 'module_year_module_course',
                where: { course_year_id: courseYearId },
              },
              {
                model: Module,
                as: 'module_year_module',
                attributes: ['id','title','year','code','CATs']
              },
            ]
          }
        ]
      },
      {
        model: UserCourse,
        as: 'user_user_course',
        where: { course_year_id: courseYearId },
        include: [
          {
            model: Course,
            as: 'user_course_course',
            include: [
              {
                model: QualificationLevel,
                as: 'course_qualification_level'
              }
            ]
          },
          {
            model: CourseYear,
            as: 'user_course_course_year',
          }
        ]
      }
    ],
  })
  if(!user) return null

  return formatUserModulesFromCourseYear(user)
}

async function getUserStudents(userId) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix', 'forename', 'surname'],
    include: [
      {
        model: UserModule,
        as: 'user_module_user',
        include: [
          {
            model: ModuleYear,
            as: 'user_module_module_year',
            include: [
              {
                model: StudentModule,
                as: 'module_year_student_module',
                include: [
                  {
                    model: Student,
                    as: 'student_module_student',
                    required: true,
                    distinct: true,
                  }
                ]
              },
            ]
          }
        ]
      }
    ]
  })
  if(!user) return null

  return formatUserStudents(user)
}

async function getUserModule(userId, moduleId) {
  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix', 'forename', 'surname'],
    include: [
      {
        model: UserModule,
        as: 'user_module_user',
        where: { user_id: userId, module_id: moduleId },
        include: [
          {
            model: ModuleYear,
            as: 'user_module_module_year',
            required: true,
            include:
            [
              {
                model: User,
                as: 'module_year_module_coordinator',
                attributes: ['prefix', 'forename', 'surname']
              },
              {
                model: Semester,
                as: 'module_year_semester',

              },
              {
                model: Module,
                as: 'module_year_module',
                attributes: ['id','title','year','code','CATs']
              },
              {
                model: StudentModule,
                as: 'module_year_student_module',
                attributes: ['student_id', 'result', 'flagged', 'resit'],
                include: [
                  {
                    model: ResultDescriptor,
                    as: 'student_module_result_descriptor',
                    attributes: ['descriptor']
                  }
                ]
              },
              {
                model: ModuleCourse,
                as: 'module_year_module_course',
                include:
                [
                  {
                    model: CourseYear,
                    as: 'module_course_course_year',
                    include:
                    [
                      {
                        model: Course,
                        as: 'course_year_course'
                      }
                    ]
                  }
                ]
              },
            ]
          }
        ]
      },
    ]
  })
  if(!user) return null

  return formatOneUserOneModule(user)
}


async function getUsersFromCourseYear(courseYearId) {
  const users = await UserCourse.findAll({
    where: { course_year_id: courseYearId },
    include: [
      {
        model: User,
        as: 'user_course_user',
        attributes: ['id', 'prefix', 'forename', 'surname' ],
        include: [
          {
            model: Role,
            as: 'user_role',
            attributes: ['name']
          },
        ]
      }
    ]
  })
  return formatUsersFromCourseYears(users)
}

async function getUsersFromSchool(schoolId) {
  const users = await UserSchool.findAll({
    where: { school_id: schoolId },
    include:
    [
      {
        model: User,
        as: 'user_school_user',
        attributes: ['id', 'prefix', 'forename', 'surname' ],
        include: [
          {
            model: Role,
            as: 'user_role',
            attributes: ['name']
          },
        ]
      }
    ]
  })
  return formatUsersFromSchool(users)
}

const getUsersFromModule = async (moduleId) => {
  const users = await User.findAll({
    include: [
      {
        model: UserModule,
        where: { module_id: moduleId },
        attributes: [],
        as: 'user_module_user',
      },
      {
        model: Role,
        as: 'user_role',
        attributes: ['name'],
      }
    ],
    attributes: ['id', 'prefix', 'forename', 'surname'],
    distinct: true
  })
  if(!users) return null
  //return users
  return formatUsersFromModule(users)
}

async function updateUser(userId, { forename, surname, email, password, active, roleId, jobTitle, prefix, schools }) {
  const user = await User.findOne({ where: { id: userId } })
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  if(schools) {
    // remove all the scholls
    await UserSchool.destroy({ where: { user_id: userId } })

    // Then add them all back that have been passed.
    for (const schoolId of schools) {
      await UserSchool.create({ user_id: userId, school_id: schoolId })
    }
  }


  // update the user details
  user.forename = forename
  user.surname = surname
  user.email = email
  user.active = active
  user.role_id = roleId
  user.job_title = jobTitle
  user.prefix = prefix

  if (password) {
    // hash the password before saving
    const passwordHash = await bcrypt.hash(password, 10)
    user.password = passwordHash
  }

  await user.save()
  return user
}

module.exports = {
  getAllUsers,
  getUser,
  getUserCourses,
  getUserModulesFromCourseYear,
  createUser,
  getUserModules,
  getUserStudents,
  getUserModule,
  getUsersFromCourseYear,
  getUsersFromSchool,
  getUsersFromModule,
  getOneUserDetails,
  updateUser
}