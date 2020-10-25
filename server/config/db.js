var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'donkeycargo.cmc4nhmz7bua.us-east-1.rds.amazonaws.com',
  //host: 'donkeycargo.cn3up4gwqfwc.us-east-1.rds.amazonaws.com',
  user: 'donkey',
  password: 'donkey123',
  database: 'donkeycargo',
  multipleStatements: true

  // host: 'sql169.main-hosting.eu',
  // user: 'u886875923_boobo',
  // password: 'booboo123',
  // database: 'u886875923_boobo',
  // multipleStatements: true

  /*host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'donkeycargo'*/
});

module.exports = connection;