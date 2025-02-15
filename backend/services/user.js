const { School, UserSchool, Role, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse } = require('../models')
const { formatAllUsers } = require('../helper/formaters/user/formatAllUsers')
const { formatUserModulesFromCourseYear } = require('../helper/formaters/user/formatUserModulesFromCourseYear')
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
        model: Course,
        as: 'all_courses',
        attributes: ['id', 'title', 'years', 'code', 'part_time'],
        through: { attributes: [] },
        include: [
          {
            model: QualificationLevel,
            as: 'qualification_level',
            attributes: ['qualification'],
          },
          {
            model: CourseYear,
            as: 'course_years',
            attributes: ['id', 'year_start', 'year_end'],
            include: [
              {
                model: Course,
                as: 'course',
                attributes: ['title', 'years', 'code', 'part_time'],
              },
              {
                model: User,
                as: 'course_co-ordinator',
                attributes: ['forename', 'surname']
              }
            ],
          },
        ],
      },
    ],
  })

  if(!user) return null

  return user
}

async function getUserModulesFromCourseYear(userId, courseYearId) {

  const user = await User.findOne({
    where: { id: userId },
    attributes: ['id', 'prefix', 'forename', 'surname'],
    include: [
      {
        model: Module,
        as: 'modules',
        attributes: ['id', 'title', 'code', 'CATs', 'year'],
        through: { attributes: [] },
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
                where: { course_year_id: courseYearId },
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
                        where: { id: courseYearId },
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
      },
    ],
  })
  if(!user) return null

  return formatUserModulesFromCourseYear(user)
}


module.exports = {
  getAllUsers,
  getUserCourses,
  getUserModulesFromCourseYear,
}