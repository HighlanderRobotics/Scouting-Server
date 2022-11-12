// To connect to the database
const sqlite = require("sqlite3").verbose()
const axios = require("axios")

// API Key
require("dotenv").config()

class Manager {
    static db = new sqlite.Database('./test.db', sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, (err) => {
        if (err)
            console.error(err);
    });
    
    // Print teams
    static getTeams() {
        var sql = `SELECT * FROM teams ORDER BY teamnumber`
        Manager.db.all(sql, (err, storedTeams) => {

            if (err) {
                console.error(err)
                return `(Ask Barry) Error with getTeams(): ${err}`
            }

            // console.log(storedTeams)
            return storedTeams;
        })
    }

    static initServer() {
        var sql = `PRAGMA foreign_keys = ON`

        // Shouldn't give a response if it runs correctly, just enables foreign keys
        db.get(sql, (err) => {
            if (err) {
                return `(Ask Barry) Error: ${err}`
            }
        })
    }

    static resetAndPopulateServer() {
        var createTeams = `CREATE TABLE teams(key TEXT ONLY PRIMARY KEY, teamNumber INTEGER, teamName TEXT ONLY, UNIQUE (key, teamNumber, teamName));`

        var createTournaments = `CREATE TABLE tournaments (key TEXT ONLY PRIMARY KEY, name TEXT ONLY, location VARCHAR(50), date TEXT ONLY VARCHAR(20), UNIQUE (key, date));`

        var createMatches = `CREATE TABLE matches (key PRIMARY KEY, gameKey TEXT ONLY NOT NULL, matchNumber INTEGER, teamKey TEXT ONLY NOT NULL, matchType TEXT ONLY NOT NULL, UNIQUE (gameKey, matchNumber, teamKey), FOREIGN KEY(gameKey) REFERENCES tournaments(key), FOREIGN KEY(teamKey) REFERENCES teams(key));`

        var createData = `CREATE TABLE data (id INTEGER PRIMARY KEY, matchKey INTEGER NOT NULL, data VARCHAR(3000), UNIQUE (matchKey, data), FOREIGN KEY(matchKey) REFERENCES matches(key));`
        
        b.serialize(() => {
            db.run("DROP TABLE IF EXISTS `teams`")
            db.run(createTeams, (err) => {if (err) {console.error(`teams ${err}`)}})
            
            db.run("DROP TABLE IF EXISTS `tournaments`")
            db.run(createTournaments, (err) => {if (err) {console.error(`tournaments ${err}`)}})
    
            db.run("DROP TABLE IF EXISTS `matches`")
            db.run(createMatches, (err) => {if (err) {console.error(`matches ${err}`)}})
    
            db.run("DROP TABLE IF EXISTS `data`")
            db.run(createData, (err) => {if (err) {console.error(`data ${err}`)}})
        })

        // Fix after setting up promises for API teams and tournaments
        const loadAPIData = () => {
            Manager.addAPITeams().then((err) => cb(err))
            Manager.addAPITournament().then((err) => cb(err))
        }
        
        loadAPIData((response) => {
            console.log(response)
        })
    }

    static async addAPITeams() {
        var url = "https://www.thebluealliance.com/api/v3"
        
        var sql = `INSERT INTO teams (key, teamNumber, teamName) VALUES (?, ?, ?)`

        // Convert into a promise
        for (var j = 0; j < 18; j++) {
            axios.get(`${url}/teams/${j}/simple`, {
                headers: {'X-TBA-Auth-Key': process.env.KEY}
            })
              .then(response => {
                for (var i = 0; i < response.data.length; i++) {
                  Manager.db.run(sql, [response.data[i].key, response.data[i].team_number, response.data[i].nickname], (err) => {
                    if (err) {console.error(`Error with ${response.data[i]}`)}
                  })
                  // console.log(response.data[i].key);
                }
                
                
            }).catch(error => {
                console.log(error);
            });
            console.log(`Logged page ${j}`)
        }
    }

    static async addAPITournaments() {
        var url = "https://www.thebluealliance.com/api/v3"

        var sql = `INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)`

        axios.get(`${url}/events/2022/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
            .then(response => {
            for (var i = 0; i < response.data.length; i++) {
                // Convert into a promise
                db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key])
            }
            
            
        }).catch(error => {
            console.log(error);
        });
    }

    // Add matches from tournament
    static async addMatches(name, date) {
        var url = "https://www.thebluealliance.com/api/v3"

        var sql = `SELECT * FROM tournaments WHERE name = '${name}' AND date = '${date}'`
        
        // Get tournaments
        async function insertion() {
            return new Promise(function (resolve,reject) {
                Manager.db.all(sql, (err, tournament) => {
                if (err) {
                    console.error(`(Ask Barry) Error with addMatches(): ${err}`)
                    reject(`(Ask Barry) Error with addMatches(): ${err}`)
                }
                if (tournament[0] == undefined) {
                    console.log(`(Ask Barry) Error with addMatches(): Tournament not found`)
                    reject(`(Ask Barry) Error with addMatches(): Tournament not found`) 
                } else {
                    for (var i = 0; i < tournament.length; i++) {
                        // Get matches in tournament
                        axios.get(`${url}/event/${tournament[i].key}/matches/simple`, {
                            headers: {'X-TBA-Auth-Key': process.env.KEY}
                        }).then(async response => {
                            // For each match in the tournament
                            await actualInsert(response, tournament).catch(error => {
                                resolve(`No issues with getting tournaments. Issue with inserting data: ${error}`)
                            })
                        }).catch(error => {
                            resolve(`(Ask Barry) Error with getting tournaments: ${error}`)
                        }).then(async response => {
                            resolve(`No issues with getting tournaments. No issues with inserting into database.`)
                        })
                    }
                }
            })})
        }

        async function actualInsert(response, tournament) {
            return new Promise(function(resolve,reject){
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].comp_level == "qm") {
                        var teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                        var matches = ``
                        for (var k = 0; k < teams.length; k++) {
                            matches = matches + `('${response.data[i].key}_${k}', '${tournament[0].key}', ${response.data[i].match_number}, '${teams[k]}', '${response.data[i].comp_level}'), `
                            if (k == 5) {
                                matches = matches.substring(0, matches.length - 2)
                            }
                        }
                        var sql = `INSERT INTO matches (key, gameKey, matchNumber, teamKey, matchType) VALUES ${matches}`
                        
                        Manager.db.run(sql, (err) => {
                            if (err) {
                                if (err.code == `SQLITE_CONSTRAINT` && err.message.includes(`UNIQUE constraint failed`)) {
                                    reject(`(Your Fault) Error with addMatches(): Matches already exist in the database.`)
                                    
                                } else {
                                    reject(`(Ask Barry) Error with addMatches(): Problem with adding tournaments to database. Err: ${err}`)
                                }                                        
                            } else {
                                resolve(`no issues with inserting into database`)
                            }
                        })
                    }
                }
            })
        }

        return await insertion()
    }
}

// Manager.addMatches("Chezy Champs", "2022-09-23")
module.exports = Manager