const Manager = require('./Manager.js')
const axios = require('axios');

class AddScoutReport extends Manager {
    static name = 'addScoutReport'

    constructor() {
        super()
    }

    runTask(teamKey, tournamentKey, data) {
        let bruv = ""
        let errorCode = 400
        let localMatchKey = `${tournamentKey}_${data.key}`
        // console.log(localMatchKey)
        // console.log(teamKey)
        // console.log(tournamentKey)
        let sql = `
        SELECT * FROM matches 
        WHERE
            teamKey = '${teamKey}'
            AND gameKey = '${tournamentKey}'
            AND SUBSTRING(key, 1, LENGTH(key)-1) = '${localMatchKey}_'
        `

        return new Promise((resolve, reject) => {
            Manager.db.get(sql, (err, match) => {
                // console.log(match)
                if (err) {
                    console.error(err)
                    errorCode = 500
                    reject(err)
                } else if (match != undefined) {
                    this.insertData(match.key, data)
                    .catch((err) => {
                        if (err) {
                            bruv = "SQLITE UNIQUE ERROR, run node testapi.js"
                            console.log(err)
                            errorCode = 500
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
                    errorCode = 406
                    reject(`Match doesn't exist`)
                }
            })
        })
        .catch((err) => {
            if (err) {
                return {
                    "results": err,
                    "errorStatus": true,
                    "customCode": errorCode,
                    "justForJacob": bruv
                }
            } else {
                return {
                    "results": err,
                    "errorStatus": false
                }
            }
        })
        .then((results) => {
            return results
        })
    }

    async insertData(matchKey, data) {
        var insert = `INSERT INTO data (uuid, matchKey, scouterName, defenseQuality, defenseQuantity, startTime, scoutReport, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        
        // Rename game to competition
        try {
            var constantData = {
                uuid: data.uuid,
                scouterName: data.scouterName,
                defenseQuality: data.overallDefenseRating,
                defenseQuantity: data.defenseFrequencyRating,
                startTime: data.startTime,
                notes: data.notes
            }
        } catch (err) {
            return (err)
        }

        
        var gameDependent = {}

        for (var key of Object.keys(data)) {
            if (key !== `uuid` 
                && key !== 'competitionKey'
                && key !== 'matchNumber'
                && key !== 'teamNumber'
                && key !== 'scouterName'
                && key !== 'startTime'
                && key !== 'defenseFrequencyRating'
                && key !== 'overallDefenseRating'
                && key !== 'notes'
                ) {

                gameDependent[key] = data[key]
            }
        }


        return new Promise((resolve, reject) => {
            Manager.db.run(insert, [constantData.uuid, matchKey, constantData.scouterName, constantData.defenseQuality, constantData.defenseQuantity, constantData.startTime, JSON.stringify(gameDependent), constantData.notes], (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
}

module.exports = AddScoutReport