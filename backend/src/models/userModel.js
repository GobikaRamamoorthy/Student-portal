const store = require('../config/dataStore');

const COLLECTION = 'users';

function all() {
  return store.read(COLLECTION);
}

function findByEmail(email) {
  if (!email) return null;
  const target = String(email).toLowerCase();
  return all().find((u) => u.email.toLowerCase() === target) || null;
}

function findById(id) {
  return all().find((u) => u.id === id) || null;
}

function save(users) {
  return store.write(COLLECTION, users);
}

/** Strip sensitive fields before sending a user to the client. */
function sanitize(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

module.exports = { all, findByEmail, findById, save, sanitize };
