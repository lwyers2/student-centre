const { Module } = require('../../models')

async function seedModules() {
  const modules = await Module.bulkCreate([
    { title: 'Introduction to Performing', year: 1, code: 'DRA0001', CATs: '20' },
    { title: 'Theatre Now: Contemporary Performance', year: 1, code: 'DRA0002', CATs: '20' },
    { title: 'Production Practices', year: 1, code: 'DRA0003', CATs: '20' },
    { title: 'Introduction to Theatre: The Material Stage', year: 1, code: 'DRA0004', CATs: '20' },
    { title: 'Introduction to Acting for Stage and Screen', year: 1, code: 'DRA0005', CATs: '20' },
    { title: 'Modernist Theatre', year: 2, code: 'DRA0006', CATs: '20' },
    { title: 'Drama and Mental Health', year: 2, code: 'DRA0007', CATs: '20' },
    { title: 'Radio Drama', year: 2, code: 'DRA0008', CATs: '20' },
    { title: 'Adaptation as Interdisciplinary Practice', year: 2, code: 'DRA0009', CATs: '20' },
    { title: 'Educational Drama', year: 2, code: 'DRA0010', CATs: '20' },
    { title: 'The Art of the Actor', year: 2, code: 'DRA0011', CATs: '20' },
    { title: 'Gender, Culture, and Representation - Backwards & in Heels', year: 2, code: 'DRA0012', CATs: '20' },
    { title: 'Principles of Business in Arts, Cultural and Creative Industries', year: 2, code: 'DRA0013', CATs: '20' },
    { title: 'Acting for Musical Theatre', year: 2, code: 'DRA0014', CATs: '20' },
    { title: 'Acting Shakespeare', year: 2, code: 'DRA0015', CATs: '20' },
    { title: 'Dramaturgy', year: 2, code: 'DRA0016', CATs: '20' },
    { title: 'Advanced Musical Theory', year: 3, code: 'DRA0017', CATs: '20' },
    { title: 'Advanced Theatre Practice', year: 3, code: 'DRA0018', CATs: '20' },
    { title: 'Beckett in Performance', year: 3, code: 'DRA0020', CATs: '20' },
    { title: 'Dance Theatre', year: 3, code: 'DRA0021', CATs: '20' },
    { title: 'Postconflict Drama: Performing the NI Peace Process', year: 3, code: 'DRA0022', CATs: '20' },
    { title: 'Solo Performance', year: 3, code: 'DRA0023', CATs: '20' },
    { title: 'Work-based Learning', year: 3, code: 'DRA0024', CATs: '20' },
    { title: 'The Art of Interaction', year: 3, code: 'DRA0025', CATs: '20' },
    { title: 'Participatory Performance Practices', year: 3, code: 'DRA0026', CATs: '20' },
    { title: 'Dissertation', year: 3, code: 'DRA0027', CATs: '20' },
    { title: 'Adaptation as Interdisciplinary Practice', year: 1, code: 'DRA0019', CATs: '20' },
    { title: 'Editing for Screen', year: 1, code: 'FSP0001', CATs: '20' },
    { title: 'Introduction to Film Practice', year: 1, code: 'FSP0002', CATs: '20' },
    { title: 'Introduction to Film Studies 1', year: 1, code: 'FSP0003', CATs: '20' },
    { title: 'Fiction Film Practice', year: 2, code: 'FSP0004', CATs: '20' },
    { title: 'Popular Genres', year: 2, code: 'FSP0005', CATs: '20' },
    { title: 'British Cinema: Nation, Identity and Industry', year: 2, code: 'FSP0006', CATs: '20' },
    { title: 'Broadcast Journalism', year: 2, code: 'FSP0007', CATs: '20' },
    { title: 'Experimental Practice', year: 2, code: 'FSP0008', CATs: '20' },
    { title: 'Creative Enterprise in Film and Digital Media', year: 2, code: 'FSP0009', CATs: '20' },
    { title: 'Film and Sound: History and Theory', year: 2, code: 'FSP0010', CATs: '20' },
    { title: 'World Cinema', year: 2, code: 'FSP0011', CATs: '20' },
    { title: 'Documentary Film Studies', year: 2, code: 'FSP0012', CATs: '20' },
    { title: 'Non-fiction Film Practice', year: 2, code: 'FSP0013', CATs: '20' },
    { title: 'Transnational Crime Cinema', year: 3, code: 'FSP0014', CATs: '20' },
    { title: 'Cinema and the Environment', year: 3, code: 'FSP0015', CATs: '20' },
    { title: 'Media and Time', year: 3, code: 'FSP0016', CATs: '20' },
    { title: 'Film and Music: Theory and Criticism', year: 3, code: 'FSP0017', CATs: '20' },
    { title: 'Advanced Film Practice 1', year: 3, code: 'FSP0018', CATs: '20' },
    { title: 'Advanced Film Practice 2', year: 3, code: 'FSP0019', CATs: '20' },
    { title: 'Dissertation', year: 3, code: 'FSP0020', CATs: '20' },
  ])
  return modules.reduce((acc, module) => ({
    ...acc,
    [`${module.title}`]: module.id
  }), {})
}

module.exports = { seedModules }