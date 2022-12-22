const axios = require('axios');
const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
  if (err)
      console.error(err)
});
require('dotenv').config()

const fs = require('fs')

// var url = 'https://www.thebluealliance.com/api/v3'
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
// const Writable = require('stream').Writable
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
//         console.log('Logger - ', line)
//     }
// }

// // Create a new named format
// morgan.token('timed', 'A new :method request for :url was received. ' +
//     'It took :total-time[2] milliseconds to be resolved')

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

// var sql = `SELECT * FROM data ORDER BY id`

// Manager.db.each(sql, (err, row) => {
//   if (err) {
//     console.error(err)
//   }
//   console.log(row)
// })

// const map = new Map()

// map.set({'num': 0, 'uuid':'3243423'}, 'asdf')
// map.set({'num': 1, 'uuid':'3243423'}, 'asadf')
// map.set({'num': 2, 'uuid':'3243423'}, 'afssdf')
// map.set({'num': 3, 'uuid':'3243423'}, 'asddf')
// map.set({'num': 5, 'uuid':'3243423'}, 'asdfaf')
// map.set({'num': 4, 'uuid':'3243423'}, 'asdsf')

// map.set(4, '4')
// map.set(2, '2')
// map.set(1, '1')
// map.set(3, '3')
// map.set(0, '0')
// map.set(5, '5')
// map.set(6, '6')

// for (var i = 0; i < 6; i++)
//   console.log(map.get(i))

// map.forEach((value, key) => {
//   console.log(`${key.num}: ${value}`)
// })

// var createData = `
//         CREATE TABLE data (
//             id INTEGER PRIMARY KEY,
//             matchKey INTEGER NOT NULL, 
//             scouterId TEXT ONLY VARCHAR(25) NOT NULL,
//             defenseQuality INTEGER NOT NULL,
//             defenseQuantity INTEGER NOT NULL, 
//             startTime INTEGER NOT NULL,
//             scoutReport VARCHAR(5000),
//             notes BLOB VARCHAR (250),
//             UNIQUE (matchKey, scouterId, scoutReport), 
//             FOREIGN KEY(matchKey) REFERENCES matches(key),
//             FOREIGN KEY(scouterId) REFERENCES scouters(id)
//         );`

// Manager.db.serialize(() => {
//   Manager.db.run('DROP TABLE IF EXISTS `data`', ((err) => {if (err){console.log(`dropData ${err}`)}}))
//   Manager.db.run(createData, ((err) => {if (err){console.log(`createData ${err}`)}}))

// })

let data = fs.readFileSync(`${__dirname}/scouters/./scouters.json`, 'utf8', (err) => {
  if (err) {
      return 'Error reading scouters file'
  }
})

data = JSON.parse(data)

for (var i = 0; i < data.scouters.length; i++) {
  console.log(data.scouters[i].name)
}