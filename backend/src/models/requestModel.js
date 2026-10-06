const { v4: uuid } = require('uuid');
const store = require('../config/dataStore');

const COLLECTION = 'requests';

const STATUS = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
});

function all() {
  return store.read(COLLECTION);
}

function findById(id) {
  return all().find((r) => r.id === id) || null;
}

function findByStatus(status) {
  if (!status) return all();
  return all().filter((r) => r.status === status);
}

function findByStudentId(studentId) {
  return all().filter((r) => r.studentId === studentId);
}

function create(data) {
  const records = all();
  const record = {
    id: uuid(),
    status: STATUS.PENDING,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    ...data,
  };
  records.unshift(record);
  store.write(COLLECTION, records);
  return record;
}

function update(id, patch) {
  const records = all();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...patch };
  store.write(COLLECTION, records);
  return records[idx];
}

function save(records) {
  return store.write(COLLECTION, records);
}

module.exports = { all, findById, findByStatus, findByStudentId, create, update, save, STATUS };
