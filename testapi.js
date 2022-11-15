// const axios = require('axios');
// const sqlite = require("sqlite3").verbose()
// const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
//   if (err)
//       console.error(err)
// });
// require("dotenv").config()

// var url = "https://www.thebluealliance.com/api/v3"
// console.log(new Date())
// var sql = `INSERT INTO teams (teamNumber, teamName, teamKey) VALUES (?, ?, ?)`
// var sql = `INSERT INTO games (name, location, date, key) VALUES (?, ?, ?, ?)`
// var sql = `INSERT INTO matches (gameId, matchId, teamNumber, key) VALUES (?, ?, ?, ?)`
// var sql = `PRAGMA foreign_keys`

// db.get(sql, (err, res) => {
//   if (err) {
//     console.log(err)
//   }
//   if (res) {
//     console.log(res)
//   }
// })

// for (var j = 0; j < 1; j++) {
  // axios.get(`${url}/teams/${j}/simple`, {
  // axios.get(`${url}/events/2022/simple`, {
  // axios.get(`${url}/event/2022cc/matches`, {
  //   headers: {'X-TBA-Auth-Key': process.env.KEY}
  // })
  //   .then(response => {
  //     for (var i = 0; i < response.data.length; i++) {
  //       // db.run(sql, [response.data[i].team_number, response.data[i].nickname, response.data[i].key])
  //       // db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key])
  //       // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[0], response.data[i].key])
  //       // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.red.team_keys[1], response.data[i].key])
  //       // db.run(sql, [28, response.data[i].match_number, response.da88ta[i].alliances.red.team_keys[2], response.data[i].key])
  //       // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[0], response.data[i].key])
  //       // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[1], response.data[i].key])
  //       // db.run(sql, [28, response.data[i].match_number, response.data[i].alliances.blue.team_keys[2], response.data[i].key])
  //       console.log(response.data[i].alliances.blue.team_keys[0])

  //     }
      
      
  // })
  //   .catch(error => {
  //     console.log(error);
  //   });
  // console.log(`Logged page ${j}`)
// }

// const express = require('express')
// const morgan = require('morgan')
// const Writable = require("stream").Writable
// const fs = require('fs')
// const path = require('path')
// const app = express()
// const port = 4000

// let logStream = fs.createWriteStream(path.join(`${__dirname}/logs`, `Logs_${new Date()}.log`), { flags: 'a' })

// // setup the logger
// app.use(morgan('combined', {
//     stream: logStream
// }))

// class MyStream extends Writable {
//     write(line) {
//         // Here you send the log line to wherever you need
//         console.log("Logger - ", line)
//     }
// }

// // Create a new named format
// morgan.token("timed", "A new :method request for :url was received. " +
//     "It took :total-time[2] milliseconds to be resolved")

// let writer = new MyStream()

// // Use the new format by name
// app.use(morgan('timed', {
//     stream: writer
// }))

// app.get('/', function(req, res) {
//     res.send('Hello, World!!!')
// })

// app.get('/ayo', function(req, res) {
//   res.send('ayo, World!!!')
// })

// app.listen(port, () => {
//    console.log(`Sample app listening at http://localhost:${port}`)
// })