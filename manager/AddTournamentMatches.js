const Manager = require('./Manager.js')
const axios = require('axios');

class AddTournamentMatches extends Manager {
    static name = 'addTournamentMatches'

    constructor() {
        super()
    }

    runTask(name, date) {
        var url = 'https://www.thebluealliance.com/api/v3'

        var sql = `SELECT * FROM tournaments WHERE name = '${name}' AND date = '${date}'`

        return new Promise((resolve, reject) => {

            Manager.db.all(sql, (err, tournament) => {
                if (err) {
                    console.error(`Error with addMatches(): ${err}`)
                    reject({
                        "result": `Error with addMatches(): ${err}`,
                        "customCode": 500
                    })
                }
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
                                    await this.whyGodInsert(sql)
                                    .catch((err) => {
                                        if (err) {
                                            // console.log(err)
                                            reject({
                                                "result": err,
                                                "customCode": 500
                                            })
                                        }
                                    })
                                } else {
                                    // console.log("red" + response.data[i].alliances.red.team_keys)
                                    // console.log("blue" + response.data[i].alliances.blue.team_keys)
                                    var teams = [...response.data[i].alliances.red.team_keys, ...response.data[i].alliances.blue.team_keys]
                                    var matches = ``
                                    for (var k = 0; k < 6; k++) {
                                        // console.log(teams[k])
                                        matches = matches + `('${response.data[i].key.substring(0, response.data[i].key.length-2)}_${k}', '${tournament[0].key}', ${response.data[i].key.substring(response.data[i].key.length-3, response.data[i].key.length-2)}, '${teams[k]}', '${response.data[i].comp_level}'), `
                                        if (k == 5) {
                                            matches = matches.substring(0, matches.length - 2)
                                        }
                                    }
                                    var sql = `INSERT INTO matches (key, tournamentKey, matchNumber, teamkey, matchType) VALUES ${matches}`
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