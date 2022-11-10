const axios = require('axios');
const sqlite = require("sqlite3").verbose()
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
  if (err)
      console.error(err)
});
require("dotenv").config()

var url = "https://www.thebluealliance.com/api/v3"

// var sql = `INSERT INTO teams (teamNumber, teamName, teamKey) VALUES (?, ?, ?)`
// var sql = `INSERT INTO games (name, location, date, key) VALUES (?, ?, ?, ?)`
var sql = `INSERT INTO matches (gameId, matchId, teamNumber, key) VALUES (?, ?, ?, ?)`

for (var j = 0; j < 1; j++) {
  // axios.get(`${url}/teams/${j}/simple`, {
  // axios.get(`${url}/events/2022/simple`, {
  axios.get(`${url}/event/2022cc/matches`, {
    headers: {'X-TBA-Auth-Key': process.env.KEY}
  })
    .then(response => {
      for (var i = 0; i < response.data.length; i++) {
        // db.run(sql, [response.data[i].team_number, response.data[i].nickname, response.data[i].key])
        // db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key])
        // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[0], response.data[i].key])
        // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[1], response.data[i].key])
        // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[2], response.data[i].key])
        // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[0], response.data[i].key])
        // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[1], response.data[i].key])
        // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[2], response.data[i].key])
        console.log(response.data[i].alliances.blue.team_keys[0])

      }
      
      
  })
    .catch(error => {
      console.log(error);
    });
  // console.log(`Logged page ${j}`)
}

