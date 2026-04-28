const db = require("../config/db");

const Category = {
  getAll: (callback) => {
    const sql = "SELECT * From categories";
    db.query(sql, callback);
  },
};

module.exports = Category;
