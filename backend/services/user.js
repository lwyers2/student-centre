const {School, Role, Student, Course, Module, User, QualificationLevel, CourseYear, ModuleYear, Semester, ModuleCourse } = require('../models')
const { formatAllUsers } = require('../helper/formaters/user/formatAllUsers')
async function getAllUsers() {
  const users = await User.findAll({
    attributes: ['id', 'forename', 'surname', 'email', 'active', 'date_created', 'date_updated'],
    include: [
      {
        model: School,
        attributes: ['school_name'],
        as: 'school'
      },
      {
        model: Role,
        as: 'role',
        attributes: ['name'],
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

module.exports = {
  getAllUsers,
  getUserCourses,
}