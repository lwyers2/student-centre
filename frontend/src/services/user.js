import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async credentials => {
  const response = await axios.get(baseUrl, credentials)
  return response.data
}

const getUser = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const getAllUserCourses = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}/courses`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getUserModulesCourseYear = async (id, courseYearID, token) => {
  const response = await axios.get(`${baseUrl}/${id}/modules/${courseYearID}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

export default { getAll, getUser, getAllUserCourses, getUserModulesCourseYear }