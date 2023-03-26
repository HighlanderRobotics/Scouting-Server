// To connect to the database
const sqlite = require('sqlite3').verbose()
const axios = require('axios');
const { resolve } = require('path');
const fs = require('fs');

// API Key
require('dotenv').config()

class Manager {
    static db = new sqlite.Database(`${__dirname}/.././test.db`, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, (err) => {
        if (err)
            console.error(err);
    });
    
    // Print teams
    static getTeams() {
        var sql = `SELECT * FROM teams ORDER BY teamnumber`

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, storedTeams) => {
                if (err) {
                    console.error(`Error with getTeams(): ${err}`)
                    reject(`Error with getTeams(): ${err}`)
                } else {
                    resolve(storedTeams);
                }
            })
        }).catch((err) => {
            return err
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

    static addScoutReport(teamKey, tournamentKey, data) {

        var sql = `
        SELECT * FROM matches WHERE
            teamKey = '${teamKey}' AND
            tournamentKey = '${tournamentKey}' AND
            matchNumber = ${data.matchNumber}
        `

        async function insertData(matchKey, data) {
            var insert = `INSERT INTO data (matchKey, scouterName, defenseQuality, defenseQuantity, startTime, scoutReport, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`
            
            // Rename game to competition
            try {
                var constantData = {
                    scouterName: data.constantData.scouterName,
                    defenseQuality: data.constantData.defenseQuality,
                    defenseQuantity: data.constantData.defenseQuantity,
                    startTime: data.constantData.startTime,
                    notes: data.constantData.notes
                }
            } catch (err) {
                return (err)
            }

            
            var gameDependent = {}

            for (var key of Object.keys(data)) {
                if (key !== `scouterName` && key !== 'defense' && key !== 'notes' && key !== 'startTime') {
                    gameDependent[key] = data[key]
                }
            }


            return new Promise((resolve, reject) => {
                Manager.db.run(insert, [matchKey, constantData.scouterName, constantData.defenseQuality, constantData.defenseQuantity, constantData.startTime, JSON.stringify(gameDependent), constantData.notes], (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            })
        }

        return new Promise((resolve, reject) => {
            Manager.db.get(sql, (err, match) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else if (match != undefined) {
                    insertData(match.key, data)
                    .catch((err) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        }
                    })
                    .then(() => {
                        console.log(`Data entry complete for ${match.key}`)
                        resolve(`Data successfully entered`)
                    })
                } else {
                    console.log(`Couldn't find match for:`)
                    console.log(data)
                    console.log(teamKey)
                    reject(`Match doesn't exist`)
                }
            })
        })
        .catch((err) => {
            if (err) {
                // console.error(err)
                return err
            }
        })
        .finally(() => {
            return `Success`
        })
    }

    static resetAndPopulateDB() {
        var createTeams = `CREATE TABLE teams(key TEXT ONLY PRIMARY KEY, teamNumber INTEGER, teamName TEXT ONLY, UNIQUE (key, teamNumber, teamName));`

        var createTournaments = `CREATE TABLE tournaments (key TEXT ONLY PRIMARY KEY, name TEXT ONLY, location VARCHAR(50), date TEXT ONLY VARCHAR(20), UNIQUE (key, date));`

        var createMatches = `CREATE TABLE matches (key PRIMARY KEY, tournamentKey TEXT ONLY NOT NULL, matchNumber INTEGER, teamKey TEXT ONLY, matchType TEXT ONLY NOT NULL, UNIQUE (tournamentKey, teamKey, matchType, matchNumber), FOREIGN KEY(tournamentKey) REFERENCES tournaments(key), FOREIGN KEY(teamKey) REFERENCES teams(key));`

        var createPicklists = `CREATE TABLE sharedPicklists (uuid PRIMARY KEY, name TEXT ONLY NOT NULL, cubeOneScore INTEGER, cubeTwoScore INTEGER, cubeThreeScore INTEGER coneOneScore INTEGER, coneTwoScore INTEGER, coneThreeScore INTEGER, autoCargo INTEGER, teleopScore INTEGER, defenseScore INTEGER, autoCLimb INTEGER, feedCone INTEGER, feedCube INTEGER, avgTotal INTEGER, teleopClimb INTEGER, driverAbility  INTEGER);`
        // Probably finalized lmk if there's any other datapoints
        var createData = `
        CREATE TABLE data (
            uuid PRIMARY KEY,
            matchKey INTEGER NOT NULL, 
            scouterName TEXT ONLY VARCHAR(25) NOT NULL,
            startTime INTEGER NOT NULL,
            scoutReport VARCHAR(5000),
            notes BLOB VARCHAR (250),
            UNIQUE (matchKey, scouterName, scoutReport), 
            FOREIGN KEY(matchKey) REFERENCES matches(key),
            FOREIGN KEY(scouterName) REFERENCES scouters(id)
        );`

        var createScouters = `
        CREATE TABLE scouters (
            name TEXT ONLY PRIMARY KEY,
            phoneNumber INTEGER,
            email VARCHAR(100),
            UNIQUE (name, phoneNumber)
        )`
        
        function removeAndAddTables() {
            return new Promise(function (resolve, reject) {
                Manager.db.serialize(() => {
                    // See of there's a better fix than turning foreign keys off for dropping tables with data in them
                    Manager.db.run(`PRAGMA foreign_keys = 0`, ((err) => {if (err){console.log(`foreign keys ${err}`)}}))

                    Manager.db.run('DROP TABLE IF EXISTS `teams`', ((err) => {if (err){console.log(`dropTeams ${err}`)}}))
                    Manager.db.run(createTeams, ((err) => {if (err){console.log(`createTeams`)}}))
                    
                    Manager.db.run('DROP TABLE IF EXISTS `tournaments`', ((err) => {if (err){console.log(`dropTourney ${err}`)}}))
                    Manager.db.run(createTournaments, ((err) => {if (err){console.log(`createTourney ${err}`)}}))
            
                    Manager.db.run('DROP TABLE IF EXISTS `matches`', ((err) => {if (err){console.log(`dropMatches ${err}`)}}))
                    Manager.db.run(createMatches, ((err) => {if (err){console.log(`createMatches ${err}`)}}))
            
                    Manager.db.run('DROP TABLE IF EXISTS `data`', ((err) => {if (err){console.log(`dropData ${err}`)}}))
                    Manager.db.run(createData, ((err) => {if (err){console.log(`createData ${err}`)}}))

                    Manager.db.run('DROP TABLE IF EXISTS `sharedPicklists`', ((err) => {if (err){console.log(`dropMatches ${err}`)}}))
                    Manager.db.run(createPicklists, ((err) => {if (err){console.log(`createPicklists ${err}`)}}))

                    Manager.db.run('DROP TABLE IF EXISTS `scouters`', ((err) => {if (err){console.log(`dropScouters ${err}`)}}))
                    Manager.db.run(createScouters, ((err) => {if (err){console.log(`createScouters ${err}`)} else {
                        // Resolve should be here
                        resolve()
                    }}))
                })
                // DON'T PUT THE RESOLVE HERE BECAUSE THE DB RUNS INSTRUCTIONS ASYNCHRONOUSLY AND THUS WILL RESOLVE BEFORE TABLES ARE RESET
                // resolve()
            })
        }

        async function turnOnForeignKeys() {
            Manager.db.run(`PRAGMA foreign_keys = 1`, ((err) => {
                if (err){
                    console.log(`foreign keys ${err}`)
                } else {
                    return
                }
            }))
        }

        return new Promise((resolve, reject) => {
            removeAndAddTables()
            .catch((err) => {
                if (err) {
                    reject(err)
                }
            })
            .then(async () => {
                await Manager.addAPITeams()
                await Manager.addAPITournaments(2022)
                await Manager.addAPITournaments(2023)
                await Manager.addScouters()
                await turnOnForeignKeys()
            })
            .then(() => {
                resolve(`Successfully reset tables`)
            })
        })
    }

    static async addAPITeams() {
        var url = 'https://www.thebluealliance.com/api/v3'
        
        var sql = `INSERT INTO teams (key, teamNumber, teamName) VALUES (?, ?, ?)`

        async function insertTeam(sql, response, i) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, [response.data[i].key, response.data[i].team_number, response.data[i].nickname], (err) => {
                    if (err) {
                        console.error(`Error inserting teams: ${response.data[i]}`)
                        reject(`Error inserting teams: ${response.data[i]}`)
                    } else {
                        resolve()
                    }
                })
            })
        }

        for (var j = 0; j < 18; j++) {
            console.log(`Inserting teams ${Math.round((j/18)*100)}%`)
            await axios.get(`${url}/teams/${j}/simple`, {
                headers: {'X-TBA-Auth-Key': process.env.KEY}
            })
            .then(async (response) => {
                for (var i = 0; i < response.data.length; i++) {
                    await insertTeam(sql, response, i)
                }
            }).catch(err => {
                if (err) {
                    console.error(`Error with getting teams from TBA API: ${err}`)
                    return err                    
                }
            }).then(() => {
                if (j === 17) {
                    console.log(`Finished inserting API teams`)
                    return
                }
            })
        }
    }

    static async addAPITournaments(year) {
        var url = 'https://www.thebluealliance.com/api/v3'

        var sql = `INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)`

        async function insertTournament(sql, response, i) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, [response.data[i].name, response.data[i].city, response.data[i].start_date, response.data[i].key], (err) => {
                    if (err) {
                        console.error(`Error inserting tournament: ${err}`)
                        reject(`Error inserting tournament: ${err}`)
                    } else {
                        resolve()
                    }
                })
            })
        }

        await axios.get(`${url}/events/${year}/simple`, {
            headers: {'X-TBA-Auth-Key': process.env.KEY}
        })
        .then(async (response) => {
            for (var i = 0; i < response.data.length; i++) {
                await insertTournament(sql, response, i)
                .catch((err) => {
                    if (err) {
                        console.log(`Error with inserting tournament: ${err}`)
                        reject(err)
                    }
                })
            }
        }).catch(err => {
            if (err) {
                console.error(`Error with inserting API Tournaments: ${err}`)
                return(`Error with inserting API Tournaments: ${err}`)    
            }
        })
        .then(() => {
            console.log(`Finished inserting tournaments`)
            return
        })
    }

    static async addScouters() {
        let sql = `INSERT INTO scouters (name, phoneNumber) VALUES (?,?)`

        // Will eventually read from a file, is temporary until I get a full team list
        var scouters = getScouters()

        async function insertScouter(sql, scout, i) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, [scout.name, scout.number], (err) => {
                    if (err) {
                        console.error(`Error inserting scouters: ${err}`)
                        reject(`Error inserting scouters: ${err}`)
                    } else {
                        resolve()
                    }
                })
            })
        }

        async function runInsertScouters() {
            for (var i = 0; i < scouters.length; i++) {
                // console.log(scouters[i])
                await insertScouter(sql, scouters[i], i)
                .catch((err) => {
                    if (err) {
                        console.log(`Error with inserting scouter: ${err}`)
                        reject(err)
                    }
                })
            }
        }

        await runInsertScouters()
        .catch(err => {
            if (err) {
                console.error(`Error with inserting Scouters: ${err}`)
                return(`Error with inserting Scouters: ${err}`)    
            }
        })
        .then(() => {
            console.log(`Finished inserting Scouters`)
            return
        })

        function getScouters() {
            let data = JSON.parse(fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8'))
            return data.scouters
        }
    }

    // Add matches from tournament
    static addMatches(name, date) {
        var url = 'https://www.thebluealliance.com/api/v3'

        var sql = `SELECT * FROM tournaments WHERE name = '${name}' AND date = '${date}'`
        
        async function whyGodInsert(sql) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, (err) => {
                    if (err) {
                        reject(`Error with inserting match: ${err}, ${sql}`)
                    } else {
                        resolve()
                    }
                })
            })
        }

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, tournament) => {
                if (err) {
                    console.error(`Error with addMatches(): ${err}`)
                    reject(`Error with addMatches(): ${err}`)
                }
                if (tournament[0] == undefined) {
                    console.error(`Error with addMatches(): Tournament not found`)
                    reject(`Error with addMatches(): Tournament not found`)
                } else {
                    for (var i = 0; i < tournament.length; i++) {
                        // Get matches in tournament
                        axios.get(`${url}/event/${tournament[i].key}/matches/simple`, {
                            headers: {'X-TBA-Auth-Key': process.env.KEY}
                        }).then(async response => {
                            // For each match in the tournament
                            for (var i = 0; i < response.data.length; i++) {
                                // console.log(`${response.data[i].comp_level} ${response.data[i].match_number}`)
                                if (response.data[i].comp_level == 'qm') {
                                    var teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                                    var matches = ``
                                    for (var k = 0; k < teams.length; k++) {
                                        matches = matches + `('${response.data[i].key}_${k}', '${tournament[0].key}', ${response.data[i].match_number}, '${teams[k]}', '${response.data[i].comp_level}'), `
                                        if (k == 5) {
                                            matches = matches.substring(0, matches.length - 2)
                                        }
                                    }
                                    var sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamKey, matchType) VALUES ${matches}`
                                    // console.log(sql)
                                    await whyGodInsert(sql)
                                    .catch((err) => {
                                        if (err) {
                                            console.log(`Error with inserting: ${err}`)
                                            reject(err)
                                        }

                                    })                           
                                }
                            }
                        }).catch(error => {
                            console.error(`Error with getting tournaments: ${error}`)
                            reject(`Error with getting tournaments: ${error}`)
                        }).then(() => {
                            console.log(`Successfully added matches`)
                            resolve(`Success`)
                        })
                    }
                }
            })
        })
        .catch((err) => {
            if (err) {
                return err
            }
        }).then((results) => {
            return results
        })
    }
}

module.exports = Manager