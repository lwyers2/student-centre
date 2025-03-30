const { ResultDescriptor } = require('../../models')

async function seedResultDescriptors() {
  const resultDescriptors = await ResultDescriptor.bulkCreate([
    { descriptor: 'p', description: 'Pass' },
    { descriptor: 'f', description: 'Fail' },
    { descriptor: 'abs', description: 'Absent' },
    { descriptor: 'absm', description: 'Absent Mitigating' },
    { descriptor: 'ph', description: 'Pass Honors Restricted' },
  ])
  // Return the full result descriptors for later use
  return resultDescriptors.reduce(
    (acc, resultDescriptor) => ({
      ...acc,
      [resultDescriptor.descriptor]: resultDescriptor, // Return the full object
    }),
    {}
  )
}

module.exports = { seedResultDescriptors }
