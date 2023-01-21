const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./test.db', sqlite.OPEN_READWRITE, (err) => {
  if (err)
      console.error(err)
})
require('dotenv').config()

var createData = `
        CREATE TABLE data (
            uuid PRIMARY KEY,
            matchKey NOT NULL, 
            scouterName TEXT ONLY VARCHAR(25) NOT NULL, 
            startTime INTEGER NOT NULL,
            scoutReport VARCHAR(5000),
            notes BLOB VARCHAR (250),
            UNIQUE (matchKey, scouterName, scoutReport), 
            FOREIGN KEY(matchKey) REFERENCES matches(key),
            FOREIGN KEY(scouterName) REFERENCES scouters(name)
        );`

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS `data`', ((err) => {if (err){console.log(`dropData ${err}`)}}))
  db.run(createData, ((err) => {if (err){console.log(`createData ${err}`)}}))
})