const mysql = require('mysql');

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'qwer1234',
    database: 'myappdb',
    dialect: "mysql",
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// // Alter table to add foreign key constraint
// const alterSql = `
//     ALTER TABLE tasks
//     ADD CONSTRAINT fk_user_id
//     FOREIGN KEY (user_id) REFERENCES users(id)
// `;

// db.query(alterSql, (err, result) => {
//     if (err) {
//         throw err;
//     }
//     console.log('Foreign key constraint added successfully');
//     db.end();  // Close the connection after the query completes
// });

module.exports = db;