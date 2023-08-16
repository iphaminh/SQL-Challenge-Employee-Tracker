const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'employee_tracker'
});

// Export the connection
module.exports = connection;
