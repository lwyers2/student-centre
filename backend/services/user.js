const { UserModule, UserCourse, School, UserSchool, Role, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse } = require('../models')
const { formatAllUsers } = require('../helper/formaters/user/formatAllUsers')
const { formatUserModulesFromCourseYear } = require('../helper/formaters/user/formatUserModulesFromCourseYear')
const { formatUsersCourseYear } = require('../helper/formaters/user/formatUsersCourseYear')
const bcrypt = require('bcrypt')

async function getAllUsers() {
  const users = await User.findAll({
    attributes: ['id', 'forename', 'surname', 'email', 'active', 'date_created', 'date_updated'],
    include: [
      {
        model: UserSchool,
        as: 'user_user_school',
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
      },
    ],
  })
  if(!users) return null

  return formatAllUsers(users)
  //return users
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
  //return user
}

const createUser = async ({ forename, surname, email, password, active, token, roleName, jobTitle, prefix }) => {
  // Validate required fields
  if (!forename || !surname || !email || !password || !roleName) {
    throw new Error('Missing required fields')
  }

  // Find the role by name
  const role = await Role.findOne({ where: { name: roleName } })
  if (!role) {
    throw new Error('Role not found')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create the new user
  return await User.create({
    forename,
    surname,
    email,
    password: passwordHash,
    date_created: new Date(),
    date_updated: new Date(),
    active: active ?? true,
    token,
    role_id: role.id,
    job_title: jobTitle,
    prefix,
  })
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
      }
    ],
  })
  if(!user) return null

  //return user
  return formatUserModulesFromCourseYear(user)
}


module.exports = {
  getAllUsers,
  getUserCourses,
  getUserModulesFromCourseYear,
  createUser
}