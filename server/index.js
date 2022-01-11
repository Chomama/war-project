//packages
const path = require("path");
const express = require("express");
const db = require("./config/db.config");
const cors = require("cors");

//create app
const app = express();
const PORT = process.env.PORT || 3001; //set port
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//serve front end static files
app.use(express.static(path.resolve(__dirname, "../client/build")));

// API's
// =============================================================================
var router = express.Router(); // get an instance of the express Router

//start endpoint

//get wins for player
app.get("/getWins", (req, res) => {
  const playerId1 = req.query.playerId1;
  const playerId2 = req.query.playerId2;
  db.query(
    "SELECT WINS FROM Player WHERE playerId = ? OR playerId = ?",
    [playerId1, playerId2],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});

//update wins for player
app.post("/updateWins", (req, res) => {
  const playerId = req.query.playerId;
  db.query(
    "UPDATE Player SET wins = wins + 1 WHERE playerId = ?",
    playerId,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
    }
  );
});

module.exports = app;
