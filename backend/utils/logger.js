const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // Mask sensitive data in logs
    const filteredParams = params.map(param => maskSensitiveData(param))
    console.log(...filteredParams)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // Mask sensitive data in logs
    const filteredParams = params.map(param => maskSensitiveData(param))
    console.error(...filteredParams)
  }
}

// Function to mask sensitive data from logs
const maskSensitiveData = (data) => {
  if (typeof data === 'string') {
    // If the data is a string, mask passwords or other sensitive fields
    return data.replace(/password=[^&]*/gi, 'password=*****')
      .replace(/"password":"[^"]*"/gi, '"password":"*****"')
      .replace(/"token":"[^"]*"/gi, '"token":"*****"')
  }
  if (typeof data === 'object') {
    // If the data is an object (e.g., request body), iterate and mask sensitive fields
    return Object.keys(data).reduce((acc, key) => {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        acc[key] = '*****' // Mask sensitive fields
      } else {
        acc[key] = data[key]
      }
      return acc
    }, {})
  }
  return data
}

module.exports = { info, error }
