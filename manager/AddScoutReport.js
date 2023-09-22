const Manager = require('./Manager.js')
const axios = require('axios');
const isFullyScouted = require('./isFullyScouted.js');
const updateEPA = require('../analysis/general/updateEPA.js');
const { rows } = require('jstat');

class AddScoutReport extends Manager {
    static name = 'addScoutReport'

    constructor() {
        super()
    }

    runTask(teamKey, tournamentKey, data) {
        let localMatchKey = `${tournamentKey}_${data.matchKey}`
       
        let sql = `
        SELECT * FROM matches 
        WHERE
            teamKey = '${teamKey}'
            AND tournamentKey = '${tournamentKey}'
            AND SUBSTRING(key, 1, LENGTH(key)-1) = '${localMatchKey}_'
        `
        var sqlMatchNumber = `SELECT matchNumber
        FROM matches
        WHERE matches.key = ?`

        let matchKey = null

        // console.log(sql)

        return new Promise((resolve, reject) => {

            Manager.db.get(sql, (err, match) => {
                if (err) {

                    console.error(err)


                    reject({

                        "result": err,

                        "customCode": 500
                    })
                } else if (match != undefined) {
                    matchKey = match.key
                    this.insertData(match.key, data)
                    .catch((err) => {
                        if (err) {
                            console.log(err)
                            reject({
                                "results": err,
                                "customCode": 500,
                                "justForJacob":  "SQLITE UNIQUE ERROR, run node resetDataTable.js"
                            })
                        }
                    })
                    .then(() => {
                        console.log(`Data entry complete for ${match.key}`)
                        Manager.db.all(sqlMatchNumber,[matchKey], async (err, row) => {
                            if(err)
                            {
                                console.log(err)
                                reject(err)
                            }
                            else if (row == undefined || row.length === 0)
                            {
                                console.log("can't find match number")
                            }
                            else
                            {
                                await new isFullyScouted().runTask(row[0].matchNumber)
                            }
                            resolve("done")

                        })
                    })
                  
                } else {
                    console.log(`Couldn't find match for:`)
                    reject({
                        "results": `Match doesn't exist`,
                        "customCode": 406
                    })
                }
            })
        })
    }

    async insertData(matchKey, data) {
        var insert = `INSERT INTO data (uuid, matchKey, scouterName, startTime, scoutReport, notes) VALUES (?, ?, ?, ?, ?, ?)`
        //  defenseQuality, defenseQuantity, also add 2 more ?, ?, if defense is added back
        // Rename game to competition
        try {
            var constantData = {
                uuid: data.uuid,
                scouterName: data.scouterName,
                // defenseQuality: data.overallDefenseRating,
                // defenseQuantity: data.defenseFrequencyRating,
                startTime: data.startTime,
                notes: data.notes
            }
        } catch (err) {
            return (err)
        }

        
        var gameDependent = {}




        for (var key of Object.keys(data)) {

            if (key !== `uuid` 

                && key !== 'tournamentKey'

                && key !== 'matchKey'

                && key !== 'teamNumber'

                && key !== 'scouterName'

                && key !== 'startTime'

                && key !== 'defenseFrequencyRating'

                && key !== 'overallDefenseRating'

                && key !== 'notes'

                && key !== 'hasSavedToCloud'

                ) {




                gameDependent[key] = data[key]

            }

        }

        // console.log(gameDependent)




        return new Promise((resolve, reject) => {

            Manager.db.run(insert, [constantData.uuid, matchKey, constantData.scouterName, /*constantData.defenseQuality, constantData.defenseQuantity, */constantData.startTime, JSON.stringify(gameDependent), constantData.notes], (err) => {
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