import axios from 'axios'
const baseUrl = '/api/modules'

const getAll = async credentials => {
  const response = await axios.get(baseUrl, credentials)
  return response.data
}

const getModule = async id => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

const getModuleFromModuleYear = async (id, token) => {
  const response = await axios.get(`${baseUrl}/module-year/${id}`,
    {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })

  return response.data
}

export default { getAll, getModule, getModuleFromModuleYear }