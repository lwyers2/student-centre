import axios from 'axios'
const baseUrl = '/api/courses'

const getAll = async token => {
  const response = await axios.get(`${baseUrl}`,{
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getOneCourse = async (token, courseId) => {
  const response = await axios.get(`${baseUrl}/${courseId}`,{
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getCoursesFromSchool = async (token, schoolId) => {
  const response = await axios.get(`${baseUrl}/schools/${schoolId}`,{
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const updateCourseYear = async (token, courseId, courseYearId, courseCoordinatorId) => {
  const response = await axios.put(`${baseUrl}/update-course-year/course/${courseId}/course-year/${courseYearId}`, {
    course_coordinator: courseCoordinatorId
  }, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const addCourseYear = async (token, courseId, startYear, courseYears, courseCoordinatorId) => {
  const response = await axios.post(`${baseUrl}/add-course-year/course/${courseId}`, {
    yearStart: startYear,
    courseYears: courseYears,
    courseCoordinatorId: courseCoordinatorId
  }, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const updateCourse = async (token, courseId, updatedCourse) => {
  const response = await axios.put(`${baseUrl}/edit-course/${courseId}`, updatedCourse, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

export const addUserToCourse = async (token, userId, courseYearId, courseId) => {
  const response = await axios.post(
    `${baseUrl}/assign-course-year-to-user`,
    {
      userId,
      courseYearId,
      courseId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const removeUserFromCourse = async (token, userId, courseYearId, courseId) => {
  const response = await axios.delete(
    `${baseUrl}/remove-user-from-course`,
    {
      data: {
        userId,
        courseYearId,
        courseId,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  return response.data
}

export default {
  getAll,
  getOneCourse,
  getCoursesFromSchool,
  updateCourseYear,
  addCourseYear,
  updateCourse,
  addUserToCourse,
  removeUserFromCourse,
}