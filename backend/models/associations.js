const Student = require('./student')
const Course = require('./course')
const User = require('./user')

Student.belongsToMany(Course, {
  through: 'student_course',
  foreignKey: 'student_id',
  otherKey: 'course_id'
})

Course.belongsToMany(Student, {
  through: 'student_course', 
  foreignKey: 'course_id',
  otherKey: 'student_id',
})

User.belongsToMany(Course, {
  through: 'user_course',
  foreignKey: 'user_id',
  otherKey: 'course_id',
})

Course.belongsToMany(User, {
  through: 'user_course',
  foreignKey: 'course_id',
  otherKey: 'user_id',
})

module.exports = { Student, Course, User }