const db = require("../config/db");

const Quiz = {
    create: (title, categoryId, callback) => {
        const sql = 'INSERT INTO quizzes (title, category_id) VALUES (?, ?)';
        db.query(sql, [title, categoryId], callback);
    }
};

module.exports = Quiz;