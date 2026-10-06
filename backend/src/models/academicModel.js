const store = require('../config/dataStore');

const COLLECTION = 'academics';

function all() {
  return store.read(COLLECTION);
}

/** All semester records for a student, ordered by semester number. */
function findByStudentId(studentId) {
  return all()
    .filter((a) => a.studentId === studentId)
    .sort((x, y) => x.semester - y.semester);
}

function findOne(studentId, semester) {
  return (
    all().find((a) => a.studentId === studentId && a.semester === Number(semester)) || null
  );
}

function update(studentId, semester, patch) {
  const records = all();
  const idx = records.findIndex(
    (a) => a.studentId === studentId && a.semester === Number(semester)
  );
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...patch, updatedAt: new Date().toISOString() };
  store.write(COLLECTION, records);
  return records[idx];
}

function save(records) {
  return store.write(COLLECTION, records);
}

module.exports = { all, findByStudentId, findOne, update, save };
