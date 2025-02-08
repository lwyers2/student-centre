const classificationsRouter = require('express').Router()
const Classification = require('../models/classification')
const Level = require('../models/level')

classificationsRouter.get('/', async (request, response) => {
  try {
    const classifications = await Classification.findAll({
      include: [
        {
          model: Level,
          as: 'classification_level',
        }
      ]
    })
    response.json(classifications)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: 'failed to fetch classifications',
      details: error.message,
    })
  }
})

module.exports = classificationsRouter