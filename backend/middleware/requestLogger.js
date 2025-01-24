const logger = require('../utils/logger')

const requestLogger = (request, response, next) => {
  const startTime = Date.now()

  response.on('finish', () => {
    //time taken for responses
    const duration = Date.now() - startTime
    logger.info(`${response.statusCode} ${request.method} ${request.path} - ${duration}ms`)
    logger.info('---')
  })

  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('Query:  ', request.query)
  next()
}

module.exports = requestLogger