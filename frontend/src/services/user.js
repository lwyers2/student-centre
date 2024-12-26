import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const getUser = async (credentials, id) => {
  const response = await axios.post(`${baseUrl}/${id}`, credentials)
  return response.data
}

export default { getAll, getUser }