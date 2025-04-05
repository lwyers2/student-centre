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

async function processStudentCSV(filePath) {
  // Counters for reporting
  let studentCount = 0
  let studentCourseCount = 0
  let studentModuleCount = 0
  const studentResults = []

  // Create an array to hold student promises for batch processing
  const studentPromises = []

  return new Promise((resolve, reject) => {
    // Create a readable stream from the file
    const stream = fs.createReadStream(filePath)
      .pipe(csvParser())

    // Event triggered for each row of data
    stream.on('data', (row) => {
      // Push the promise for each student to the studentPromises array
      const studentPromise = (async () => {
        try {
          // Validate required fields for each row
          if (!row.forename || !row.surname || !row.email || !row.student_code || !row.course_title || !row.course_year_start) {
            throw new Error(`Missing required fields in row: ${JSON.stringify(row)}`)
          }

          // 1. Find course
          const course = await Course.findOne({ where: { title: row.course_title } })
          if (!course) throw new Error(`Course not found: ${row.course_title}`)

          // 2. Find year
          const courseYear = await CourseYear.findOne({
            where: { year_start: row.course_year_start, course_id: course.id }
          })
          if (!courseYear) throw new Error(`CourseYear not found for: ${row.course_title} - ${row.course_year_start}`)

          // 3. Create student
          const student = await Student.create({
            forename: row.forename,
            surname: row.surname,
            email: row.email,
            student_code: row.student_code
          })
          studentCount++

          // 4. Create student-course link
          await StudentCourse.create({
            student_id: student.id,
            course_id: course.id,
            course_year_id: courseYear.id,
            archived: 0
          })
          studentCourseCount++

          // 5. Find required modules for the course year
          const moduleYears = await ModuleCourse.findAll({
            where: { course_year_id: courseYear.id, required: 1 }
          })

          // 6. Find or create the 'Pending' result descriptor
          const [pendingDescriptor] = await ResultDescriptor.findOrCreate({
            where: { description: 'Pending' },
            defaults: { description: 'Pending', descriptor: 'pen' }
          })

          // 7. Create student-module links
          for (const moduleYear of moduleYears) {
            await StudentModule.create({
              student_id: student.id,
              module_year_id: moduleYear.module_year_id,
              module_id: moduleYear.module_id,
              result: 0,
              resit: 0,
              flagged: 0,
              descriptor_id: pendingDescriptor.id
            })
            studentModuleCount++
          }

          // Collect the student data (you can return this later in the response)
          studentResults.push(student)

        } catch (error) {
          console.error('Error processing row:', row, error)
        }
      })()

      // Push the student's processing promise into the array
      studentPromises.push(studentPromise)
    })

    // Event triggered when file parsing ends
    stream.on('end', async () => {
      try {
        // Wait for all student processing promises to resolve
        await Promise.all(studentPromises)

        // Resolve after all processing is complete
        resolve({
          students: studentResults, // Returning only the processed students
          stats: {
            studentsAdded: studentCount,
            studentCourseLinks: studentCourseCount,
            studentModuleAssignments: studentModuleCount
          }
        })

        // Optionally, delete the uploaded file after processing
        fs.unlink(filePath, (err) => {
          if (err) console.error('File deletion error:', err)
        })

      } catch (err) {
        reject(err) // If anything fails, reject the promise
      }
    })

    // Event triggered when an error occurs during the file stream
    stream.on('error', (err) => {
      reject(err) // Reject if there's a stream error
    })
  })
}

module.exports = { processStudentCSV }
