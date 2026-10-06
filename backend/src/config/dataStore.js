const fs = require('fs');
const path = require('path');

/**
 * A tiny file-based persistence layer.
 *
 * Each "collection" is a JSON file in the data directory holding an array of
 * records. This keeps the project dependency-free (no DB engine, no native
 * build tools) while still isolating data access behind a single module so it
 * can later be swapped for a real database without touching the models.
 */
const DATA_DIR = path.join(__dirname, '..', 'data');

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function read(collection) {
  ensureDir();
  const file = filePath(collection);
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file, 'utf-8').trim();
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    throw new Error(`Failed to read collection "${collection}": ${err.message}`);
  }
}

function write(collection, records) {
  ensureDir();
  fs.writeFileSync(filePath(collection), JSON.stringify(records, null, 2), 'utf-8');
  return records;
}

module.exports = { DATA_DIR, read, write };
