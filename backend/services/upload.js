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

const BATCH_SIZE = 50 // Adjust the batch size as needed

// Function to parse CSV into chunks
async function parseCSVIntoChunks(filePath) {
  return new Promise((resolve, reject) => {
    const students = [] // All students data
    const stream = fs.createReadStream(filePath)
      .pipe(csvParser())

    stream.on('data', (row) => {
      students.push(row) // Add each row to the students array
    })

    stream.on('end', () => {
      resolve(students) // Resolve the students array when done
    })

    stream.on('error', (err) => {
      reject(err) // Reject if there's an error in the stream
    })
  })
}

async function processChunk(chunk) {
  const studentResults = []
  const studentCourses = []
  const studentModules = []

  // Loop through each student in the chunk
  for (const row of chunk) {
    if (!row.forename || !row.surname || !row.email || !row.student_code || !row.course_title || !row.course_year_start) {
      continue // Skip processing this row if fields are missing
    }

    // 1. Find or create course
    const course = await Course.findOne({ where: { title: row.course_title } })
    if (!course) throw new Error(`Course not found: ${row.course_title}`)

    // 2. Find or create course year
    const courseYear = await CourseYear.findOne({
      where: { year_start: row.course_year_start, course_id: course.id }
    })
    if (!courseYear) throw new Error(`CourseYear not found for: ${row.course_title} - ${row.course_year_start}`)

    // 3. Prepare student data for bulk insert
    const student = {
      forename: row.forename,
      surname: row.surname,
      email: row.email,
      student_code: row.student_code
    }
    studentResults.push(student)

    // Prepare student-course data for later bulk inserts
    studentCourses.push({
      student_id: null,  // Placeholder
      course_id: course.id,
      course_year_id: courseYear.id,
      archived: 0
    })

    // Find required modules for the course year
    const moduleYears = await ModuleCourse.findAll({
      where: { course_year_id: courseYear.id, required: 1 }
    })

    // Deduplicate moduleYears (if needed)
    const uniqueModuleYears = Array.from(new Set(moduleYears.map(m => m.module_id)))
      .map(moduleId => moduleYears.find(m => m.module_id === moduleId))

    // Find or create the 'Pending' result descriptor
    const [pendingDescriptor] = await ResultDescriptor.findOrCreate({
      where: { description: 'Pending' },
      defaults: { description: 'Pending', descriptor: 'pen' }
    })

    // Prepare student-module data for later bulk inserts
    for (const moduleYear of uniqueModuleYears) {
      studentModules.push({
        student_id: null,  // Placeholder
        module_year_id: moduleYear.module_year_id,
        module_id: moduleYear.module_id,
        result: 0,
        resit: 0,
        flagged: 0,
        descriptor_id: pendingDescriptor.id
      })
    }
  }

  // Proceed with bulk insert only if there are valid records
  if (studentResults.length === 0 || studentCourses.length === 0 || studentModules.length === 0) {
    return { studentsAdded: 0, studentCourseLinks: 0, studentModuleAssignments: 0 }
  }

  // 1. Bulk create students first
  const students = await Student.bulkCreate(studentResults, { returning: true })
  if (!students || students.length === 0) {
    return { success: false, message: 'No students returned from bulk insert' }
  }

  // 2. Assign student IDs to studentCourses and studentModules
  students.forEach((student, index) => {
    studentCourses[index].student_id = student.id
    studentModules.forEach((module) => {
      module.student_id = student.id
    })
  })

  // 3. Bulk create student-course links
  await StudentCourse.bulkCreate(studentCourses)

  // 4. Bulk create student-module links
  await StudentModule.bulkCreate(studentModules)

  // Return success stats after bulk inserts
  return {
    studentsAdded: studentResults.length,
    studentCourseLinks: studentCourses.length,
    studentModuleAssignments: studentModules.length,
  }
}

// Function to process the CSV in batches
async function processStudentCSV(filePath) {
  // Parse the CSV into chunks
  const students = await parseCSVIntoChunks(filePath)

  // Split students into batches (chunk size = BATCH_SIZE)
  const chunkedStudents = []
  for (let i = 0; i < students.length; i += BATCH_SIZE) {
    chunkedStudents.push(students.slice(i, i + BATCH_SIZE))
  }

  // Process each chunk sequentially
  let totalStats = {
    studentsAdded: 0,
    studentCourseLinks: 0,
    studentModuleAssignments: 0
  }

  for (const chunk of chunkedStudents) {
    const stats = await processChunk(chunk)
    totalStats.studentsAdded += stats.studentsAdded
    totalStats.studentCourseLinks += stats.studentCourseLinks
    totalStats.studentModuleAssignments += stats.studentModuleAssignments
  }

  // Delete the file after processing
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
