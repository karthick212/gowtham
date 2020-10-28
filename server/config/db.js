var mysql = require('mysql');
var connection = mysql.createConnection({
  //gowtham.c25ghv7tlt4p.us-east-1.rds.amazonaws.com

  host: 'gowtham.c25ghv7tlt4p.us-east-1.rds.amazonaws.com',
  //host: 'donkeycargo.cn3up4gwqfwc.us-east-1.rds.amazonaws.com',
  user: 'gowtham',
  password: 'gowtham123',
  database: 'gowtham'

  // host: 'sql224.main-hosting.eu',
  // //host: 'donkeycargo.cn3up4gwqfwc.us-east-1.rds.amazonaws.com',
  // user: 'u997951005_root',
  // password: 'Karthik@212',
  // database: 'u997951005_freelancetyper',
  // multipleStatements: true

  //Server: sql224.main-hosting.eu
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