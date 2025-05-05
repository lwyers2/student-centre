import axios from 'axios'
const baseUrl = '/api/modules'

const getAll = async token => {
  const response = await axios.get(baseUrl, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
  return response.data
}

const getModule = async (id, token) => {
  const response = await axios.get(`${baseUrl}/${id}`, {
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
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

const getModulesFromCourseYear = async (id, token) => {
  const response = await axios.get(`${baseUrl}/course-year/${id}`,
    {
      headers: {
        'Authorization' : `Bearer ${token}`
      }
    })

  return response.data
}

export const updateModuleYear = async (token, moduleId, moduleYearId, updatedData) => {
  const response = await axios.put(
    `${baseUrl}/update-module-year/module/${moduleId}/module-year/${moduleYearId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const updateModule = async (token, moduleId, updatedData) => {
  const response = await axios.put(
    `${baseUrl}/update-module/${moduleId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const addUserToModule = async (token, userId, moduleYearId, moduleId) => {
  const response = await axios.post(
    `${baseUrl}/add-user-to-module`,
    {
      userId,
      moduleYearId,
      moduleId
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}

export const removeUserFromModule = async (token, userId, moduleYearId, moduleId) => {
  const response = await axios.delete(`${baseUrl}/remove-user-from-module`, {
    data: { userId, moduleYearId, moduleId },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}


export default { getAll,
  getModule,
  getModuleFromModuleYear,
  getModulesFromCourseYear,
  updateModuleYear,
  updateModule,
  addUserToModule,
  removeUserFromModule, }