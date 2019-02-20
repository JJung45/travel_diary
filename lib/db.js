var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1111',
    database : 'traveldiary',
  });
  
  db.connect();

  module.exports = db;