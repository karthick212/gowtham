var mysql = require('mysql');
var connection = mysql.createConnection({
  //gowtham.c25ghv7tlt4p.us-east-1.rds.amazonaws.com

  // host: 'gowtham.c25ghv7tlt4p.us-east-1.rds.amazonaws.com',
  // //host: 'donkeycargo.cn3up4gwqfwc.us-east-1.rds.amazonaws.com',
  // user: 'gowtham',
  // password: 'gowtham123',
  // database: 'gowtham'

  host: 'freelancetypers.cp6kqdu9boqh.us-east-1.rds.amazonaws.com',
  //host: 'donkeycargo.cn3up4gwqfwc.us-east-1.rds.amazonaws.com',
  user: 'gowtham',
  password: 'gowtham123',
  database: 'gowtham'
});

module.exports = connection;