const Student = require('./student')
const Course = require('./course')

Student.belongsToMany(Course, {
  through: 'student_course',
  foreignKey: 'student_id',
  otherKey: 'course_id'
})

Course.belongsToMany(Student, {
  through: 'student_course', // Name of the join table
  foreignKey: 'course_id',
  otherKey: 'student_id',
})

module.exports = { Student, Course }