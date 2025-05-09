const { Meeting, ModuleYear, ModuleCourse, Letter, StudentModule, Student, User, Module } = require('../models')
const { Op } = require('sequelize')

const createMeeting = async (studentId, moduleYearId, scheduledDate, academicId, adminStaffId, meetingReason, courseYearId) => {

  const moduleYear = await ModuleYear.findByPk(moduleYearId, {
    include: {
      model: ModuleCourse,
      as: 'module_year_module_course',
      attributes: ['course_year_id'],
      limit: 1,
    }
  })

  if (!moduleYear || !moduleYear.module_year_module_course.length) {
    throw new Error(`Module year ID ${moduleYearId} not found or not linked to a course year.`)
  }


  // Running both at same time to reduce queries
  const [moduleYears, studentModules] = await Promise.all([
    ModuleYear.findAll({
      where: { year_start: moduleYear.year_start },
      include: {
        model: ModuleCourse,
        as: 'module_year_module_course',
        where: { course_year_id: courseYearId },
      },
      attributes: ['id']
    }),
    StudentModule.findAll({
      where: { student_id: studentId },
      attributes: ['id', 'module_year_id']
    })
  ])

  const moduleYearIds = moduleYears.map(m => m.id)
  const studentModuleIds = studentModules
    .filter(sm => moduleYearIds.includes(sm.module_year_id))
    .map(sm => sm.id)

  if (!studentModuleIds.length) {
    throw new Error(`No student modules found for student ID ${studentId} in course year ID ${courseYearId}.`)
  }

  // Get the letters sent count for student for that academic year.
  const letterCount = await Letter.count({
    where: { student_module_id: studentModuleIds }
  })

  if (letterCount < 2) {
    return { success: false, message: `Student has received only ${letterCount} letter(s). A meeting is not required yet.` }
  }

  const studentModule = studentModules.find(sm => sm.module_year_id === moduleYearId)

  if (!studentModule) {
    throw new Error(`Student module not found for student ID ${studentId} and module year ID ${moduleYearId}.`)
  }

  // create meeting
  const meeting = await Meeting.create({
    student_id: studentId,
    module_year_id: moduleYearId,
    scheduled_date: scheduledDate,
    academic_id: academicId,
    admin_staff_id: adminStaffId,
    meeting_reason: meetingReason,
    course_year_id: courseYearId
  })

  console.log(`Meeting scheduled successfully for student ID ${studentId} in module year ID ${moduleYearId}.`)

  return meeting
}

const getOneMeeting = async (meetingId) => {
  const meeting = await Meeting.findOne({
    where : { id: meetingId },
    include:
    [
      {
        model: Student,
        as: 'meeting_student',
      },
      {
        model: User,
        as: 'meeting_academic_staff',
        attributes: ['id', 'prefix', 'forename', 'surname']
      },
      {
        model: User,
        as: 'meeting_admin_staff',
        attributes: ['id', 'prefix', 'forename', 'surname']
      }
    ]
  })

  return meeting
}

const updateMeeting = async (meetingId, updateData) => {
  const meeting = await Meeting.findByPk(meetingId, {
    include: [
      { model: Student, as: 'meeting_student' },
      {
        model: User,
        as: 'meeting_academic_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
      {
        model: User,
        as: 'meeting_admin_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
    ],
  })

  if (!meeting) {
    throw new Error('Meeting not found')
  }

  //update meeting
  await meeting.update(updateData)

  // get the meeting so that we can return to use in frontend
  const updatedMeeting = await Meeting.findByPk(meetingId, {
    include: [
      { model: Student, as: 'meeting_student' },
      {
        model: User,
        as: 'meeting_academic_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
      {
        model: User,
        as: 'meeting_admin_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
    ],
  })

  return updatedMeeting
}





const deleteMeeting = async (meetingId) => {
  const meeting = await Meeting.findByPk(meetingId)

  if (!meeting) {
    throw new Error('Meeting not found')
  }

  // Delete  meeting
  await meeting.destroy()
  return { success: true, message: 'Meeting deleted successfully' }
}

const getAllUserMeetings = async (userId) => {
  const meetings = await Meeting.findAll({
    where: {
      [Op.or]: [
        { academic_id: userId },
        { admin_staff_id: userId }
      ]
    },
    include: [
      { model: Student, as: 'meeting_student' },
      {
        model: User,
        as: 'meeting_academic_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
      {
        model: User,
        as: 'meeting_admin_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
    ]
  })
  return meetings
}

const getAllMeetingsForStudent = async (studentId) => {
  const meetings = await Meeting.findAll({
    where: { student_id: studentId },
    include: [
      {
        model: ModuleYear,
        as: 'meeting_module',
        include: [
          {
            model: Module,
            as: 'module_year_module',
          },
          {
            model: StudentModule,
            as: 'module_year_student_module',
            where: { student_id: studentId },
          }
        ]
      },
      {
        model: User,
        as: 'meeting_academic_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
      {
        model: User,
        as: 'meeting_admin_staff',
        attributes: ['id', 'prefix', 'forename', 'surname'],
      },
    ]
  })

  return meetings
}

module.exports = { createMeeting, getOneMeeting, updateMeeting, deleteMeeting, getAllUserMeetings, getAllMeetingsForStudent }
