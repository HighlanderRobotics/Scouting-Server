const Manager = require('./Manager.js')
const axios = require("axios");

class AddScoutReport extends Manager {
    static name = "AddScoutReport"

    constructor() {
        super()
    }

    runTask(teamKey, tournamentKey, data) {
        var sql = `
        SELECT * FROM matches WHERE
            teamKey = "${teamKey}" AND
            gameKey = "${tournamentKey}" AND
            matchNumber = ${data.constantData.matchNumber}
        `

        return new Promise((resolve, reject) => {
            Manager.db.get(sql, (err, match) => {
                if (err) {
                    console.error(err)
                    reject(err)
                } else if (match != undefined) {
                    this.insertData(match.key, data)
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

    async insertData(matchKey, data) {
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
}

module.exports = AddScoutReport