const Manager = require('./Manager.js')
const axios = require('axios');

class AddTournamentMatches extends Manager {
    static name = 'addTournamentMatches'

    constructor() {
        super()
    }

    runTask(key) {
        console.log(key);

        var url = 'https://www.thebluealliance.com/api/v3'

        var sql = `SELECT * FROM tournaments WHERE key = '${key}'`

        return new Promise((resolve, reject) => {

            Manager.db.all(sql, (err, tournament) => {
                if (err) {
                    console.error(`Error with addMatches(): ${err}`)
                    reject({
                        "result": `Error with addMatches(): ${err}`,
                        "customCode": 500
                    })
                }
                console.log(tournament);
                if (tournament[0] == undefined) {
                    console.error(`Error with addMatches(): Tournament not found`)
                    reject({
                        "result": `Error with addMatches(): Tournament not found`,
                        "customCode": 406
                    })
                } else {
                    for (var i = 0; i < tournament.length; i++) {
                        // Get matches in tournament
                        axios.get(`${url}/event/${tournament[i].key}/matches/simple`, {
                            headers: { 'X-TBA-Auth-Key': process.env.KEY }
                        }).then(async response => {
                            // For each match in the tournament
                            for (var i = 0; i < response.data.length; i++) {
                                if (response.data[i].comp_level == 'qm') {
                                    var teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                                    let matchesString = ``
                                    for (var k = 0; k < teams.length; k++) {
                                        matchesString = matchesString + `('${response.data[i].key}_${k}', '${tournament[0].key}', ${response.data[i].match_number}, '${teams[k]}', '${response.data[i].comp_level}'), `
                                        if (k == 5) {
                                            // Get rid of the trailing comma
                                            matchesString = matchesString.substring(0, matchesString.length - 2)
                                        }
                                    }

                                    var sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamKey, matchType) VALUES ${matchesString}`

                                    await this.whyGodInsert(sql)
                                        .catch((err) => {
                                            if (err) {
                                                reject({
                                                    "result": err,
                                                    "customCode": 500
                                                })
                                            }
                                        })
                                } else if (response.data[i].comp_level == 'f') {
                                    teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                                    let matchesString = ''
                                    if (response.data[i].key.substring(response.data[i].key.length - 4, response.data[i].key.length - 2) == 'f2') {
                                        var ourKey = response.data[i].key.substring(0, response.data[i].key.length - 4) + "gf" + response.data[i].match_number;

                                        for (var k = 0; k < 6; k++) {
                                            matchesString += `('${ourKey}_${k}', '${tournament[0].key}', ${response.data[i].key.substring(response.data[i].key.length - 1, response.data[i].key.length)}, '${teams[k]}', 'gf'), `
                                            if (k == 5) {
                                                // Get rid of the trailing comma
                                                matchesString = matchesString.substring(0, matchesString.length - 2)
                                            }
                                        }

                                        sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamkey, matchType) VALUES ${matchesString}`

                                        await this.whyGodInsert(sql)
                                            .catch((err) => {
                                                if (err) {
                                                    reject({
                                                        'result': err,
                                                        'customCode': 500
                                                    })
                                                }
                                            })
                                    } else {
                                        for (var k = 0; k < 6; k++) {
                                            matchesString = matchesString + `('${response.data[i].key.substring(0, response.data[i].key.length - 2)}_${k}', '${tournament[0].key}', ${response.data[i].key.substring(response.data[i].key.length - 3, response.data[i].key.length - 2)}, '${teams[k]}', '${response.data[i].comp_level}'), `
                                            if (k == 5) {
                                                // Get rid of the trailing comma
                                                matchesString = matchesString.substring(0, matchesString.length - 2)
                                            }
                                        }

                                        sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamkey, matchType) VALUES ${matchesString}`

                                        await this.whyGodInsert(sql)
                                            .catch((err) => {
                                                if (err) {
                                                    reject({
                                                        'result': err,
                                                        'customCode': 500
                                                    })
                                                }
                                            })
                                    }
                                } else {
                                    // console.log("red" + response.data[i].alliances.red.team_keys)
                                    // console.log("blue" + response.data[i].alliances.blue.team_keys)
                                    var teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                                    var matchesString = ``
                                    for (var k = 0; k < 6; k++) {
                                        // console.log(teams[k])
                                        matchesString = matchesString + `('${response.data[i].key.substring(0, response.data[i].key.length - 2)}_${k}', '${tournament[0].key}', ${response.data[i].key.substring(response.data[i].key.length - 3, response.data[i].key.length - 2)}, '${teams[k]}', '${response.data[i].comp_level}'), `
                                        if (k == 5) {
                                            matchesString = matchesString.substring(0, matchesString.length - 2)
                                        }
                                    }
                                    var sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamkey, matchType) VALUES ${matchesString}`
                                    // console.log(sql)
                                    await this.whyGodInsert(sql)
                                        .catch((err) => {
                                            if (err) {
                                                // console.log(response.data[i].team_keys)
                                                // console.log(response.data[i].match_number)
                                                // console.log(err)
                                                reject({
                                                    "result": err,
                                                    "customCode": 500
                                                })
                                            }
                                        })
                                }
                            }

                            resolve()
                        })
                            .catch((err) => {
                                if (err) {
                                    reject({
                                        "result": "Could not connect to tba api",
                                        "customCode": 500
                                    })

                                }
                            })
                    }
                }
            })
        })
    }

    async whyGodInsert(sql) {
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
}

module.exports = AddTournamentMatches