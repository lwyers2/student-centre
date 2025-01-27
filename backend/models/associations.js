
const Module = require('./module')
const Course = require('./course')
const ModuleCourse = require('./moduleCourse')
const ModuleYear = require('./moduleYear')
const CourseYear = require('./courseYear')
const User = require('./user')
const Semester = require('./semester')
const Student = require('./student')
const School = require('./school')
const Role = require('./role')
const QualificationLevel = require('./qualificationLevel')
const Classification = require('./classification')
const Level = require('./level')
const AuthenticationUser = require('./authenticationUser')
const StudentModule = require('./studentModule')




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

// Student -> Module, will have unique false in case student needs to retake module. Could have multiple results
// Define Many-to-Many relationship between Student and Module
Student.belongsToMany(Module, {
  through: 'student_module',      // Junction table
  as: 'student_modules',       // Alias used for including this relation in queries
  foreignKey: 'student_id',    // The foreign key in the junction table for Student
  timestamps: false,
})

Module.belongsToMany(Student, {
  through: 'student_module',      // Junction table
  as: 'module_students',       // Reverse relation alias (optional)
  foreignKey: 'module_id',     // The foreign key in the junction table for Module
  timestamps: false,
})

// Define the Many-to-One relationship from StudentModule -> ModuleYear
Student.belongsToMany(ModuleYear, {
  through: 'student_module',
  timestamps: false,
  foreignKey: 'student_id',
  as: 'student_module_years',  // Alias to access module year data
})

ModuleYear.belongsToMany(Student, {
  through: 'student_module',
  timestamps: false,
  foreignKey: 'module_year_id',
  as: 'module_years', // Alias for related StudentModule records
})

// Define the Many-to-One relationship from StudentModule -> ModuleYear
StudentModule.belongsToMany(ModuleYear, {
  through: 'student_module',
  timestamps: false,
  foreignKey: 'student_id',
  as: 'student_module_module_years',  // Alias to access module year data
})

ModuleYear.belongsToMany(StudentModule, {
  through: 'student_module',
  timestamps: false,
  foreignKey: 'module_year_id',
  as: 'module_years_student_module', // Alias for related StudentModule records
})

Student.belongsToMany(StudentModule, {
  through: 'student_module',
  timestamps: false,
  foreignKey: 'student_id',
  as: 'student_student_module',
})

StudentModule.belongsToMany(Student, {
  through: 'student_module',
  timestamps: false,
  foreignKey: 'module_id',
  as: 'student_module_module',
})

// Define the Many-to-One relationship from User -> ModuleYear
User.belongsToMany(ModuleYear, {
  through: 'user_module',
  timestamps: false,
  foreignKey: 'user_id',
  as: 'user_module_years',  // Alias to access module year data
})

ModuleYear.belongsToMany(User, {
  through: 'user_module',
  timestamps: false,
  foreignKey: 'module_year_id',
  as: 'module_years_user', // Alias for related User records
})



// //Student -> ModuleCourse
// Student.belongsToMany(ModuleCourse, {
//   through: StudentModule,
//   foreignKey: 'student_id',
//   otherKey: 'module_year_id', // Or the appropriate key linking StudentModule to ModuleCourse
//   as: 'student_module_courses',
// })

// ModuleCourse.belongsToMany(Student, {
//   through: StudentModule,
//   foreignKey: 'module_year_id', // Or the appropriate key linking ModuleCourse to StudentModule
//   otherKey: 'student_id',
//   as: 'module_course_students',
// })

Student.belongsToMany(CourseYear, {
  through: 'student_course',
  as: 'student_course_years',
  foreignKey: 'student_id',
  timestamps: false,
})

CourseYear.belongsToMany(Student, {
  through: 'student_course',
  as: 'course_year_students',
  foreignKey: 'course_year_id',
  timestamps: false,
})

//User -> School
User.belongsToMany(School, {
  through: 'user_school',
  foreignKey: 'user_id',
  otherKey: 'school_id',
  timestamps: false,
  as: 'school',
})

School.belongsToMany(User, {
  through: 'user_school',
  foreignKey: 'school_id',
  otherKey: 'user_id',
  timestamps: false,
  as: 'users',
})

//User -> Role
User.belongsTo(Role, {
  foreignKey: 'role_id',
  timestamps: false,
  as: 'role',
})

Role.hasMany(User, {
  foreignKey: 'role_id',
  timestamps: false,
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

//AuthenticationUser -> User (for authentication)
AuthenticationUser.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})

User.hasMany(AuthenticationUser, {
  foreignKey: 'user_id',
  as: 'tokens'
})


module.exports =
{
  Student,
  Course,
  User ,
  Module,
  QualificationLevel,
  Classification,
  Level,
  AuthenticationUser,
  ModuleYear,
  Role,
  School,
}