const fs = require('fs')
const csvParser = require('csv-parser')
const {
  Course,
  CourseYear,
  Student,
  StudentCourse,
  ModuleCourse,
  StudentModule,
  ResultDescriptor
} = require('../models')

// do batches in size of 50
const BATCH_SIZE = 50

// parse csv into chunks
async function parseCSVIntoChunks(filePath) {
  return new Promise((resolve, reject) => {
    const students = []
    const stream = fs.createReadStream(filePath)
      .pipe(csvParser())

    stream.on('data', (row) => {
      students.push(row)
    })

    stream.on('end', () => {
      resolve(students)
    })

    stream.on('error', (err) => {
      reject(err)
    })
  })
}

async function processChunk(chunk) {
  const studentResults = []
  const studentCourses = []
  const studentModules = []

  // Loop for student chunk
  for (const row of chunk) {
    if (!row.forename || !row.surname || !row.email || !row.student_code || !row.course_title || !row.course_year_start) {
      continue //skip if required fields are missing
    }

    // find the course or throw error
    const course = await Course.findOne({ where: { title: row.course_title } })
    if (!course) throw new Error(`Course not found: ${row.course_title}`)

    // find or error on course year
    const courseYear = await CourseYear.findOne({
      where: { year_start: row.course_year_start, course_id: course.id }
    })
    if (!courseYear) throw new Error(`CourseYear not found for: ${row.course_title} - ${row.course_year_start}`)

    // create a student object
    const student = {
      forename: row.forename,
      surname: row.surname,
      email: row.email,
      student_code: row.student_code
    }
    studentResults.push(student)

    // create a student-course object with null for student_id as a placeholder
    studentCourses.push({
      student_id: null,
      course_id: course.id,
      course_year_id: courseYear.id,
      archived: 0
    })

    const moduleYears = await ModuleCourse.findAll({
      where: { course_year_id: courseYear.id, required: 1 }
    })

    const uniqueModuleYears = Array.from(new Set(moduleYears.map(m => m.module_id)))
      .map(moduleId => moduleYears.find(m => m.module_id === moduleId))

    // find or create the result descriptor
    const [pendingDescriptor] = await ResultDescriptor.findOrCreate({
      where: { description: 'Pending' },
      defaults: { description: 'Pending', descriptor: 'pen' }
    })

    // Placeholder for student_id
    for (const moduleYear of uniqueModuleYears) {
      studentModules.push({
        student_id: null,
        module_year_id: moduleYear.module_year_id,
        module_id: moduleYear.module_id,
        result: 0,
        resit: 0,
        flagged: 0,
        descriptor_id: pendingDescriptor.id
      })
    }
  }

  // If theres valid data,, bulk create.
  if (studentResults.length === 0 || studentCourses.length === 0 || studentModules.length === 0) {
    return { studentsAdded: 0, studentCourseLinks: 0, studentModuleAssignments: 0 }
  }

  //create the students in bulk
  const students = await Student.bulkCreate(studentResults, { returning: true })
  if (!students || students.length === 0) {
    return { success: false, message: 'No students returned from bulk insert' }
  }

  //map students to student courses and student modules
  students.forEach((student, index) => {
    studentCourses[index].student_id = student.id
    studentModules.forEach((module) => {
      module.student_id = student.id
    })
  })


  await StudentCourse.bulkCreate(studentCourses)

  await StudentModule.bulkCreate(studentModules)

  //stats for successful students added, but I think this is broken
  return {
    studentsAdded: studentResults.length,
    studentCourseLinks: studentCourses.length,
    studentModuleAssignments: studentModules.length,
  }
}

// split csv into chucks and process individually
async function processStudentCSV(filePath) {

  const students = await parseCSVIntoChunks(filePath)

  // split the students into seperate chunks
  const chunkedStudents = []
  for (let i = 0; i < students.length; i += BATCH_SIZE) {
    chunkedStudents.push(students.slice(i, i + BATCH_SIZE))
  }

  //stats to return for reporting
  let totalStats = {
    studentsAdded: 0,
    studentCourseLinks: 0,
    studentModuleAssignments: 0
  }

  //loop through chunks and process them.
  for (const chunk of chunkedStudents) {
    const stats = await processChunk(chunk)
    totalStats.studentsAdded += stats.studentsAdded
    totalStats.studentCourseLinks += stats.studentCourseLinks
    totalStats.studentModuleAssignments += stats.studentModuleAssignments
  }

  // delete the file after spliting
  fs.unlink(filePath, (err) => {
    if (err) console.error('File deletion error:', err)
  })

  return {
    success: true,
    message: 'CSV uploaded and processed successfully',
    stats: totalStats,
  }
}

module.exports = { processStudentCSV }
