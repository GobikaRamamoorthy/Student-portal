const store = require('../config/dataStore');

const COLLECTION = 'placements';

function all() {
  return store
    .read(COLLECTION)
    .slice()
    .sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate));
}

function findById(id) {
  return store.read(COLLECTION).find((p) => p.id === id) || null;
}

function save(records) {
  return store.write(COLLECTION, records);
}

module.exports = { all, findById, save };
