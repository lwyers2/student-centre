import axios from 'axios'
const baseUrl = '/api/students'

const getAll = async credentials => {
  const response = await axios.get(baseUrl, credentials)
  return response.data
}

const getStudent = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

export default { getAll, getStudent }