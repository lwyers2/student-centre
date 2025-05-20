const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { User, AuthenticationUser, UserModule, UserCourse } = require('../models')
const { AuthError } = require('../utils/errors')

const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '240h' })
}

const authenticateUser = async (email, password) => {

  const user = await User.findOne({ where: { email } })
  if (!user){
    throw new AuthError('Email not found', 401)
  }



  //decrypt password then check failed attempts
  const passwordCorrect = await bcrypt.compare(password, user.password)
  if (!passwordCorrect){
    user.failed_attempts += 1
    user.last_failed_attempt = new Date()
    await user.save()

    throw new AuthError('Incorrect password', 401)
  }

  if(!user.active) {
    throw new AuthError('Account is inactive', 401)
  }

  // reset failed attempts
  user.failed_attempts = 0
  user.last_failed_attempt = null
  await user.save()

  const token = generateToken(user)
  //expire in 3 hours
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000 * 3)

  await AuthenticationUser.create({
    token,
    user_id: user.id,
    expires_at: expiresAt,
    created_at: new Date(),
    is_active: true,
  })


  //storing these so that the frontend can determine what a user should be able to access.
  let accessibleModuleYears = []
  let accessableCourseYears = []
  let accessibleModules = []
  let accessibleCourses = []


  if (user.role_id === 2 || user.role_id === 1) {
    const moduleYearRecords = await UserModule.findAll({
      where: { user_id: user.id },
      attributes: ['module_year_id'],
    })
    accessibleModuleYears = moduleYearRecords.map(m => m.module_year_id)

    const courseYearRecords = await UserCourse.findAll({
      where: { user_id: user.id },
      attributes: ['course_year_id'],
    })
    accessableCourseYears = courseYearRecords.map(c => c.course_year_id)

    const moduleRecords = await UserModule.findAll({
      where: { user_id: user.id },
      attributes: ['module_id'],
    })
    accessibleModules = moduleRecords.map(m => m.module_id)
      .filter((value, index, self) => self.indexOf(value) === index)

    // unique course ids
    const courseRecords = await UserCourse.findAll({
      where: { user_id: user.id },
      attributes: ['course_id'],
    })
    accessibleCourses = courseRecords.map(c => c.course_id)
      .filter((value, index, self) => self.indexOf(value) === index)
  }

  return { token, user, accessibleModuleYears, accessableCourseYears, accessibleCourses, accessibleModules }
}

module.exports = { authenticateUser }
