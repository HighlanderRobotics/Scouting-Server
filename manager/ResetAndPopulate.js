const Manager = require('./Manager.js')
const DatabaseManager = require('.././DatabaseManager.js')
const axios = require("axios");

class ResetAndPopulate extends Manager {
    static name = "ResetAndPopulate"

    constructor() {
        super()
    }

    runTask() {
        let a = this

        var createTeams = `CREATE TABLE teams(key TEXT ONLY PRIMARY KEY, teamNumber INTEGER, teamName TEXT ONLY, UNIQUE (key, teamNumber, teamName));`

        var createTournaments = `CREATE TABLE tournaments (key TEXT ONLY PRIMARY KEY, name TEXT ONLY, location VARCHAR(50), date TEXT ONLY VARCHAR(20), UNIQUE (key, date));`

        var createMatches = `CREATE TABLE matches (key PRIMARY KEY, gameKey TEXT ONLY NOT NULL, matchNumber INTEGER, teamKey TEXT ONLY NOT NULL, matchType TEXT ONLY NOT NULL, UNIQUE (gameKey, matchNumber, teamKey), FOREIGN KEY(gameKey) REFERENCES tournaments(key), FOREIGN KEY(teamKey) REFERENCES teams(key));`

        // Probably finalized lmk if there's any other datapoints
        var createData = `
        CREATE TABLE data (
            id INTEGER PRIMARY KEY,
            matchKey INTEGER NOT NULL, 
            scouterId TEXT ONLY VARCHAR(25) NOT NULL,
            defenseQuality INTEGER NOT NULL,
            defenseQuantity INTEGER NOT NULL, 
            startTime INTEGER NOT NULL,
            scoutReport VARCHAR(5000),
            notes BLOB VARCHAR (250),
            UNIQUE (matchKey, scouterId, scoutReport), 
            FOREIGN KEY(matchKey) REFERENCES matches(key),
            FOREIGN KEY(scouterId) REFERENCES scouters(id)
        );`

        var createScouters = `
        CREATE TABLE scouters (
            id INTEGER PRIMARY KEY,
            name TEXT ONLY NOT NULL,
            UNIQUE (name)
        )`
        return new Promise((resolve, reject) => {
            this.removeAndAddTables(createTeams, createTournaments, createMatches, createData, createScouters)
            .catch((err) => {
                if (err) {
                    reject(err)
                }
            })
            .then(async () => {
                
                await a.getTeams()
                await a.getTournaments()
                await a.getScouters()
                await a.turnOnForeignKeys()
            })
            .then(() => {
                resolve(`Successfully reset tables`)
            })
        })
    }

    async turnOnForeignKeys() {
        Manager.db.run(`PRAGMA foreign_keys = 1`, ((err) => {
            if (err){
                console.log(`foreign keys ${err}`)
            } else {
                return
            }
        }))
    }

    removeAndAddTables(createTeams, createTournaments, createMatches, createData, createScouters) {
        return new Promise(function (resolve, reject) {
            Manager.db.serialize(() => {
                // See of there's a better fix than turning foreign keys off for dropping tables with data in them
                Manager.db.run(`PRAGMA foreign_keys = 0`, ((err) => {if (err){console.log(`foreign keys ${err}`)}}))

                Manager.db.run("DROP TABLE IF EXISTS `teams`", ((err) => {if (err){console.log(`dropTeams ${err}`)}}))
                Manager.db.run(createTeams, ((err) => {if (err){console.log(`createTeams`)}}))
                
                Manager.db.run("DROP TABLE IF EXISTS `tournaments`", ((err) => {if (err){console.log(`dropTourney ${err}`)}}))
                Manager.db.run(createTournaments, ((err) => {if (err){console.log(`createTourney ${err}`)}}))
        
                Manager.db.run("DROP TABLE IF EXISTS `matches`", ((err) => {if (err){console.log(`dropMatches ${err}`)}}))
                Manager.db.run(createMatches, ((err) => {if (err){console.log(`createMatches ${err}`)}}))
        
                Manager.db.run("DROP TABLE IF EXISTS `data`", ((err) => {if (err){console.log(`dropData ${err}`)}}))
                Manager.db.run(createData, ((err) => {if (err){console.log(`createData ${err}`)}}))

                Manager.db.run("DROP TABLE IF EXISTS `scouters`", ((err) => {if (err){console.log(`dropScouters ${err}`)}}))
                Manager.db.run(createScouters, ((err) => {if (err){console.log(`createScouters ${err}`)} else {
                    // Resolve should be here
                    resolve()
                }}))
            })
            // DON'T PUT THE RESOLVE HERE BECAUSE THE DB RUNS INSTRUCTIONS ASYNCHRONOUSLY AND THUS WILL RESOLVE BEFORE TABLES ARE RESET
            // resolve()
        })
    }

    async getTeams() {
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
        })
        .catch((err) => {
            if (err) {
                return err
            }
        })
        .then((results) => {
            return results
        })
    }

    async getTournaments() {
        var url = "https://www.thebluealliance.com/api/v3"

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

        await axios.get(`${url}/events/2022/simple`, {
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

    async getScouters() {
        var sql = `
        SELECT * FROM matches WHERE
            teamKey = "${teamKey}" AND
            gameKey = "${tournamentKey}" AND
            matchNumber = ${data.constantData.matchNumber}
        `

        async function insertData(matchKey, data) {
            var insert = `INSERT INTO data (matchKey, scouterId, defenseQuality, defenseQuantity, startTime, scoutReport, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`
            
            // Rename game to competition
            try {
                var constantData = {
                    scouterId: data.constantData.scouterId,
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
                if (key !== `scouterId` && key !== 'defense' && key !== 'notes' && key !== 'startTime') {
                    gameDependent[`${key}`] = `"${JSON.stringify(data[`${key}`])}"`
                }
            }


            return new Promise((resolve, reject) => {
                Manager.db.run(insert, [matchKey, constantData.scouterId, constantData.defenseQuality, constantData.defenseQuantity, constantData.startTime, JSON.stringify(gameDependent), constantData.notes], (err) => {
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
}

module.exports = ResetAndPopulate