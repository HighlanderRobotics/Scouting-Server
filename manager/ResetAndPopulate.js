const Manager = require('./Manager.js')
const axios = require('axios')
const fs = require('fs')

class ResetAndPopulate extends Manager {
    static name = 'resetAndPopulate'

    constructor() {
        super()
    }

    runTask() {
        let a = this

        var createTeams = 'CREATE TABLE teams(key TEXT ONLY PRIMARY KEY, teamNumber INTEGER, teamName TEXT ONLY, UNIQUE (key, teamNumber, teamName));'

        var createTournaments = 'CREATE TABLE tournaments (key TEXT ONLY PRIMARY KEY, name TEXT ONLY, location VARCHAR(50), date TEXT ONLY VARCHAR(20), UNIQUE (key, date));'

        var createMatches = 'CREATE TABLE matches (key PRIMARY KEY, tournamentKey TEXT ONLY NOT NULL, matchNumber INTEGER, teamKey TEXT ONLY, matchType TEXT ONLY NOT NULL, UNIQUE (tournamentKey, teamKey, matchType, matchNumber), FOREIGN KEY(tournamentKey) REFERENCES tournaments(key), FOREIGN KEY(teamKey) REFERENCES teams(key));'

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
            FOREIGN KEY(scouterName) REFERENCES scouters(name)
        );`

        var createScouters = `
        CREATE TABLE scouters (
            name TEXT ONLY PRIMARY KEY,
            phoneNumber INTEGER,
            email VARCHAR(100),
            UNIQUE (name)
        )`

        return new Promise((resolve, reject) => {
            this.removeAndAddTables(createTeams, createTournaments, createMatches, createData, createScouters)
                .catch((err) => {
                    if (err) {
                        reject({
                            'result': err,
                            'customCode': 500
                        })
                    }
                })
                .then(async () => {
                    await a.addAPITeams()
                    await a.getTournaments(2022)
                    await a.getTournaments(2023)
                    await a.getScouters()
                    await a.turnOnForeignKeys()
                })
                .catch((err) => {
                    if (err) {
                        reject({
                            'results': err,
                            'customCode': 500
                        })
                    }
                })
            resolve('Done')
        })
    }

    async turnOnForeignKeys() {
        Manager.db.run('PRAGMA foreign_keys = 1', ((err) => {
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
                Manager.db.run('PRAGMA foreign_keys = 0', ((err) => {if (err){console.log(`foreign keys ${err}`)}}))

                Manager.db.run('DROP TABLE IF EXISTS `teams`', ((err) => {if (err){console.log(`dropTeams ${err}`)}}))
                Manager.db.run(createTeams, ((err) => {if (err){console.log('createTeams')}}))
                
                Manager.db.run('DROP TABLE IF EXISTS `tournaments`', ((err) => {if (err){console.log(`dropTourney ${err}`)}}))
                Manager.db.run(createTournaments, ((err) => {if (err){console.log(`createTourney ${err}`)}}))
        
                Manager.db.run('DROP TABLE IF EXISTS `matches`', ((err) => {if (err){console.log(`dropMatches ${err}`)}}))
                Manager.db.run(createMatches, ((err) => {if (err){console.log(`createMatches ${err}`)}}))
        
                Manager.db.run('DROP TABLE IF EXISTS `data`', ((err) => {if (err){console.log(`dropData ${err}`)}}))
                Manager.db.run(createData, ((err) => {if (err){console.log(`createData ${err}`)}}))

                Manager.db.run('DROP TABLE IF EXISTS `scouters`', ((err) => {if (err){console.log(`dropScouters ${err}`)}}))
                Manager.db.run(createScouters, ((err) => {if (err){console.log(`createScouters ${err}`)} else {
                    // Resolve should be here
                    resolve()
                }}))
            })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    async addAPITeams() {
        var url = 'https://www.thebluealliance.com/api/v3'
        
        var sql = 'INSERT INTO teams (key, teamNumber, teamName) VALUES (?, ?, ?)'

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

        return new Promise(async (resolve, reject) => {
            for (var j = 0; j < 20; j++) {
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
                            reject(err)
                        }
                    }).then(() => {
                        if (j === 17) {
                            console.log('Finished inserting API teams')
                            resolve()
                        }
                    })
            }
            resolve()
        })
    }

    async getTournaments(year) {
        var url = 'https://www.thebluealliance.com/api/v3'

        var sql = 'INSERT INTO tournaments (name, location, date, key) VALUES (?, ?, ?, ?)'

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

        return new Promise((resolve, reject) => {
            axios.get(`${url}/events/${year}/simple`, {
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
                    console.log(`Inserted Tournaments for ${year}`)
                    resolve()
                })
        })   
    }

    async getScouters() {
        let sql = 'INSERT INTO scouters (name, phoneNumber, email) VALUES (?,?,?)'
        console.log('Scouters File exists: ' + fs.existsSync(`${__dirname}/../scouters/./scouters.json`))
        let scouters = await JSON.parse(fs.readFileSync(`${__dirname}/../scouters/./scouters.json`, 'utf8')).scouters

        async function insertScouter(sql, scout) {
            return new Promise((resolve, reject) => {
                Manager.db.run(sql, [scout.name, scout.number, scout.email], (err) => {
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
                await insertScouter(sql, scouters[i])
                    .catch((err) => {
                        if (err) {
                            console.log(`Error with inserting scouter: ${err}`)
                            return new Error(err)
                        }
                    })
            }
        }

        return new Promise(async (resolve, reject) => {
            await runInsertScouters()
                .catch(err => {
                    if (err) {
                        reject(err)
                    }
                })
            console.log('Scouters inserted')
            resolve()
        })
    }
}

module.exports = ResetAndPopulate