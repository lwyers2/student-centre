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

const getUserCourse = async id => {
  const response = await axios.get(`${baseUrl}/${id}/courses`)
  return response.data
}

const getUserModule = async id => {
  const response = await axios.get(`${baseUrl}/${id}/modules`)
  return response.data
}

export default { getAll, getUser, getUserCourse, getUserModule }