/**
 * Simple JSON file-based data store.
 * Provides an ORM-like API for CRUD operations.
 */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data.json');

let db = {
  users: [],
  categories: [],
  products: [],
  productSkus: [],
  cartItems: [],
  orders: [],
  orderItems: [],
  addresses: [],
  payments: [],
  reviews: [],
  favorites: [],
};

// Load from disk if exists
function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (_) {}
}

// Save to disk
function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Initialize
load();

// ===== Collection helpers =====
function collection(name) {
  return {
    findAll(filter = {}) {
      let results = [...(db[name] || [])];
      if (filter.where) {
        results = results.filter((item) => matchWhere(item, filter.where));
      }
      if (filter.order) {
        const [field, dir] = filter.order;
        results.sort((a, b) => {
          if (a[field] < b[field]) return dir === 'ASC' ? -1 : 1;
          if (a[field] > b[field]) return dir === 'ASC' ? 1 : -1;
          return 0;
        });
      }
      if (filter.limit) {
        const offset = filter.offset || 0;
        results = results.slice(offset, offset + filter.limit);
      }
      return results;
    },

    findOne(filter = {}) {
      const items = db[name] || [];
      if (filter.where) {
        return items.find((item) => matchWhere(item, filter.where)) || null;
      }
      return items[0] || null;
    },

    findByPk(id) {
      return (db[name] || []).find((item) => item.id === id) || null;
    },

    create(data) {
      const items = db[name] || [];
      const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
      const now = new Date().toISOString();
      const record = {
        id: maxId + 1,
        ...data,
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
      };
      items.push(record);
      db[name] = items;
      save();
      return { ...record };
    },

    bulkCreate(dataArray) {
      const results = [];
      for (const data of dataArray) {
        results.push(this.create(data));
      }
      return results;
    },

    update(data, filter = {}) {
      const items = db[name] || [];
      let count = 0;
      for (const item of items) {
        if (!filter.where || matchWhere(item, filter.where)) {
          Object.assign(item, data, { updatedAt: new Date().toISOString() });
          count++;
        }
      }
      save();
      return count;
    },

    destroy(filter = {}) {
      const before = (db[name] || []).length;
      if (filter.where) {
        db[name] = (db[name] || []).filter((item) => !matchWhere(item, filter.where));
      } else {
        db[name] = [];
      }
      save();
      return before - db[name].length;
    },

    count(filter = {}) {
      return this.findAll(filter).length;
    },

    sum(field, filter = {}) {
      const items = this.findAll(filter);
      return items.reduce((total, item) => total + (Number(item[field]) || 0), 0);
    },

    findAndCountAll(filter = {}) {
      const allFiltered = this.findAll({ ...filter, limit: undefined, offset: undefined });
      const rows = this.findAll(filter);
      return { rows, count: allFiltered.length };
    },
  };
}

// Match where clause (supports Op-like operators via special keys)
function matchWhere(item, where) {
  for (const [key, value] of Object.entries(where)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Operator-based matching
      if ('$like' in value) {
        const pattern = value.$like.replace(/%/g, '');
        if (!String(item[key] || '').includes(pattern)) return false;
      } else if ('$gte' in value) {
        if ((item[key] || 0) < value.$gte) return false;
      } else if ('$lte' in value) {
        if ((item[key] || 0) > value.$lte) return false;
      } else if ('$in' in value) {
        if (!value.$in.includes(item[key])) return false;
      } else if ('$or' in value) {
        // handled at parent level
      } else {
        // Nested object — skip
      }
    } else if (Array.isArray(value)) {
      if (!value.includes(item[key])) return false;
    } else {
      if (item[key] !== value) return false;
    }
  }
  return true;
}

// Helper to build Op-like where from Sequelize-style operators
const Op = {
  like: (pattern) => ({ $like: pattern }),
  gte: (val) => ({ $gte: val }),
  lte: (val) => ({ $lte: val }),
  in: (arr) => ({ $in: arr }),
  or: (...conditions) => ({ $or: conditions }),
};

module.exports = { db, collection, save, load, Op };
