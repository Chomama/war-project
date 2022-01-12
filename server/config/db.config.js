const mysql = require("mysql");
const db = mysql.createConnection({
  host: "wardb.cajxtqi5zhhl.us-east-2.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "",
  database: "war",
});

module.exports = db;
