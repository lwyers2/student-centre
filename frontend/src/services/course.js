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

export default {
  getAll,
  getOneCourse,
  getCoursesFromSchool
}