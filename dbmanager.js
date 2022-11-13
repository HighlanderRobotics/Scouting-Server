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

        // Later do differently so it doesn't keep the http request open
        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    console.error(`Error with getTeams(): ${err}`)
                    reject(`Error with getTeams(): ${err}`)
                }
                resolve(storedTeams);
            })
        })
    }

    static initServer() {
        var sql = `PRAGMA foreign_keys = ON`

        // Shouldn't give a response if it runs correctly, just enables foreign keys
        Manager.db.get(sql, (err) => {
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
        
        async function removeAndAddTables() {
            return new Promise(function (resolve, reject) {
                Manager.db.serialize(() => {
                    Manager.db.run("DROP TABLE IF EXISTS `teams`")
                    Manager.db.run(createTeams, (err) => {if (err) {reject(`(Ask Barry) Error with creating Teams Table: ${err}`)}})
                    
                    Manager.db.run("DROP TABLE IF EXISTS `tournaments`")
                    Manager.db.run(createTournaments, (err) => {if (err) {reject(`(Ask Barry) Error with creating Tournaments Table: ${err}`)}})
            
                    Manager.db.run("DROP TABLE IF EXISTS `matches`")
                    Manager.db.run(createMatches, (err) => {if (err) {reject(`(Ask Barry) Error with creating Matches Table: ${err}`)}})
            
                    Manager.db.run("DROP TABLE IF EXISTS `data`")
                    Manager.db.run(createData, (err) => {if (err) {reject(`(Ask Barry) Error with creating Data Table: ${err}`)}})
                })
                resolve()
            })
        }
        

        // Fix after setting up promises for API teams and tournaments
        const setupTables = async () => {
            await removeAndAddTables()
            .catch((err) => {
                console.error(err)
            })
            .then(() => {
                Manager.addAPITeams()
                Manager.addAPITournament()       
            })
        }
        
        setupTables()

        return
    }

    static addAPITeams() {
        var url = "https://www.thebluealliance.com/api/v3"
        
        var sql = `INSERT INTO teams (key, teamNumber, teamName) VALUES (?, ?, ?)`

        for (var j = 0; j < 18; j++) {
            axios.get(`${url}/teams/${j}/simple`, {
                headers: {'X-TBA-Auth-Key': process.env.KEY}
            })
            .then(response => {
                for (var i = 0; i < response.data.length; i++) {
                    Manager.db.run(sql, [response.data[i].key, response.data[i].team_number, response.data[i].nickname], (err) => {
                        if (err) {
                            console.error(`Error inserting teams: ${response.data[i]}`)
                        }
                    })                
                }
            }).catch(error => {
                console.error(`Error with getting teams from TBA API: ${error}`)
            });
        }
    }

    static addAPITournaments() {
        var url = "https://www.thebluealliance.com/api/v3"

        var sql = `INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)`

        axios.get(`${url}/events/2022/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
          .then(response => {
            for (var i = 0; i < response.data.length; i++) {
                db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key], (err) => {
                    if (err) {
                        console.error(`Error inserting tournament: ${err}`)
                    }
                })
            }
        }).catch(err => {
            console.error(`Error with getting API Tournaments: ${err}`)
        });

        return
    }

    // Add matches from tournament
    static addMatches(name, date) {
        var url = "https://www.thebluealliance.com/api/v3"

        var sql = `SELECT * FROM tournaments WHERE name = '${name}' AND date = '${date}'`

        async function sanityCheck(sql) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, (err) => {
                    if (err) {
                        // console.log(i)
                        // console.error(`Error with inserting match: ${err}, ${sql}`)   
                        reject(err)
                    }
                    resolve()
                })
            })
        }
        
        // Fix to use proper sqlite wrapper, ie return tournaments as variable instead of stringing stuff together with .then like a third grader
        Manager.db.all(sql, (err, tournament) => {
            if (err) {
                console.error(`Error with addMatches(): ${err}`)
            }
            if (tournament[0] == undefined) {
                console.error(`Error with addMatches(): Tournament not found`)
            } else {
                for (var i = 0; i < tournament.length; i++) {
                    // Get matches in tournament
                    axios.get(`${url}/event/${tournament[i].key}/matches/simple`, {
                        headers: {'X-TBA-Auth-Key': process.env.KEY}
                    }).then(async response => {
                        // For each match in the tournament
                        for (var i = 0; i < response.data.length; i++) {
                            // console.log(`${response.data[i].comp_level} ${response.data[i].match_number}`)
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
                                // console.log(sql)
                                await sanityCheck(sql).catch((err) => {if (err) console.log(err)})
                                
                            }
                        }
                    }).catch(error => {
                        console.error(`Error with getting tournaments: ${error}`)
                    })
                }
            }
        })

        return
    }
}
Manager.addMatches("Bordie React", "2022-10-14")
// Manager.addMatches("Chezy Champs", "2022-09-23")
module.exports = Manager