const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // hide sensitive data in logs
    const filteredParams = params.map(param => maskSensitiveData(param))
    console.log(...filteredParams)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    // had sensitive data in logs
    const filteredParams = params.map(param => maskSensitiveData(param))
    console.error(...filteredParams)
  }
}


const maskSensitiveData = (data) => {
  if (typeof data === 'string') {
    // Regex to mask sensitive data in strings
    return data.replace(/password=[^&]*/gi, 'password=*****')
      .replace(/"password":"[^"]*"/gi, '"password":"*****"')
      .replace(/"token":"[^"]*"/gi, '"token":"*****"')
  }
  if (typeof data === 'object') {
    // If the data is an object loop and mask sensitive fields
    return Object.keys(data).reduce((acc, key) => {
      if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        acc[key] = '*****'
      } else {
        acc[key] = data[key]
      }
      return acc
    }, {})
  }
  return data
}

module.exports = { info, error }
