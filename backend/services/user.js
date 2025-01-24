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

module.exports = {
  getAllUsers,
}