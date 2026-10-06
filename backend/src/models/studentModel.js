const store = require('../config/dataStore');

const COLLECTION = 'students';

function all() {
  return store.read(COLLECTION);
}

function findById(id) {
  return all().find((s) => s.id === id) || null;
}

function findByUserId(userId) {
  return all().find((s) => s.userId === userId) || null;
}

function search(query) {
  if (!query) return all();
  const q = String(query).toLowerCase();
  return all().filter(
    (s) =>
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
      (s.name && s.name.toLowerCase().includes(q))
  );
}

function update(id, patch) {
  const students = all();
  const idx = students.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  students[idx] = { ...students[idx], ...patch, id, updatedAt: new Date().toISOString() };
  store.write(COLLECTION, students);
  return students[idx];
}

function save(students) {
  return store.write(COLLECTION, students);
}

module.exports = { all, findById, findByUserId, search, update, save };
