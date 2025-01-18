const Student = require('./student')
const Course = require('./course')
const User = require('./user')
const Module = require('./module')
const Classification = require('./classification')
const QualificationLevel = require('./qualificationLevel')
const Level = require('./level')
const School = require('./school')
const Role = require('./role')
const Token = require('./token')
const CourseYear = require('./courseYear')
const ModuleYear = require('./module_year')
const ModuleCourse = require('./module_course')
const Semester = require('./semester')


// Module ->  Course
Module.belongsToMany(Course, {
  through: ModuleCourse,
  foreignKey: 'module_id',
  otherKey: 'course_id',
  as: 'courses',
})

Course.belongsToMany(Module, {
  through: ModuleCourse,
  foreignKey: 'course_id',
  otherKey: 'module_id',
  as: 'modules',
})

// ModuleCourse -> ModuleYear
ModuleCourse.belongsTo(ModuleYear, {
  foreignKey: 'module_year_id',
  as: 'module_year',
})

ModuleYear.hasMany(ModuleCourse, {
  foreignKey: 'module_year_id',
  as: 'module_courses',
})

// ModuleCourse -> Course
ModuleCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course',
})

Course.hasMany(ModuleCourse, {
  foreignKey: 'course_id',
  as: 'module_courses',
})

//Course -> Course_Year
Course.hasMany(CourseYear, {
  foreignKey: 'course_id',
  timestamps: false,
  as: 'course_years',
})

CourseYear.belongsTo(Course, {
  foreignKey: 'course_id',
  timestamps: false,
  as: 'course'
})


//User -> Course
User.belongsToMany(Course, {
  through: 'user_course',
  foreignKey: 'user_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'all_courses',
})

Course.belongsToMany(User, {
  through: 'user_course',
  foreignKey: 'course_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users'
})


//CourseYear -> User (course-cordinator)

User.hasMany(Course, {
  foreignKey: 'course_coordinator',
  timestamps: false,
  as: 'course_years'
})

CourseYear.belongsTo(User, {
  foreignKey: 'course_coordinator',
  timestamp: false,
  as: 'course_co-ordinator'
})

//ModuleYear -> User (module-cordinator)

User.hasMany(Module, {
  foreignKey: 'module_coordinator_id',
  timestamps: false,
  as: 'module_years'
})

ModuleYear.belongsTo(User, {
  foreignKey: 'module_coordinator_id',
  timestamp: false,
  as: 'module_co-ordinator'
})

//ModuleYear -> Semester

Semester.hasMany(ModuleYear, {
  foreignKey: 'semester_id',
  timestamps: false,
  as: 'module_years'
})

ModuleYear.belongsTo(Semester, {
  foreignKey: 'semester_id',
  timestamp: false,
  as: 'semester'
})


//Module -> Module_year
Module.hasMany(ModuleYear, {
  foreignKey: 'module_id',
  timestamps: false,
  as: 'module_years',
})

ModuleYear.belongsTo(Module, {
  foreignKey: 'module_id',
  timestamps: false,
  as: 'module',
})


//User -> Module
User.belongsToMany(Module, {
  through: 'user_module',
  foreignKey: 'user_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'modules'
})

Module.belongsToMany(User, {
  through: 'user_module',
  foreignKey: 'module_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users',
})

//Student -> Course
Student.belongsToMany(Course, {
  through: 'student_course',
  foreignKey: 'student_id',
  otherKey: 'course_id',
  timestamps: false,
  as: 'student_courses',
})

Course.belongsToMany(Student, {
  through: 'student_course',
  foreignKey: 'course_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})

//Student -> Module, will have unique false in case student needs to retake module. Could have multiple results
Student.belongsToMany(Module, {
  through: {
    model: 'student_module',
    unique: false,
  },
  foreignKey: 'student_id',
  otherKey: 'module_id',
  timestamps: false,
  as: 'student_modules'
})

Module.belongsToMany(Student, {
  through: {
    model: 'student_module',
    unique: false,
  },
  foreignKey: 'module_id',
  otherKey: 'student_id',
  timestamps: false,
  as: 'students',
})





//User -> School
User.belongsToMany(School, {
  through: 'user_school',
  foreignKey: 'user_id',
  otherKey: 'school_id',
})

School.belongsToMany(User, {
  through: 'user_school',
  foreignKey: 'school_id',
  otherKey: 'user_id',
})

//User -> Role
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role',
})

Role.hasMany(User, {
  foreignKey: 'role_id',
  as: 'users'
})




//Course -> QualificationLevel
Course.belongsTo(QualificationLevel, {
  foreignKey: 'qualification_id',
  as: 'qualification_level',
})

QualificationLevel.hasMany(Course, {
  foreignKey: 'qualification_id',
})

//Classification -> Level
Classification.belongsTo(Level, {
  foreignKey: 'level_id',
  as: 'level',
})

Level.hasMany(Classification, {
  foreignKey: 'level_id'
})

//Token -> User (for authentication)
Token.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})

User.hasMany(Token, {
  foreignKey: 'user_id',
})


module.exports = { Student, Course, User , Module, QualificationLevel, Classification, Level, Token }