const { re, resolve } = require('mathjs')
const Manager = require('./Manager.js')
const totalScore = require('../analysis/general/totalScoreAllPicklist')

class updatePredictions extends Manager {
    static name = "updatePredictions"

    constructor() {
        super()
    }

    async runTask(matchNumber) {
        return new Promise(function (resolve, reject) {

        const getTeamsSQL = `SELECT newTeams.teamNumber AS teamNumber
        FROM teams
        JOIN (SELECT teams.teamNumber AS teamNumber
            FROM teams 
            JOIN matches ON team.key = matches.teamKey
            WHERE matchNumber = ?) AS newTeams`
        const getEPASQL = `SELECT epa
            FROM epaTable
            WHERE team = ?`
        const addPredictions = `INSERT INTO predictions (epa, team) VALUES (?, ?)`
            Manager.db.all(getTeamsSQL, [matchNumber], async (err, rows) => {
                if(err)
                {
                    console.log(err)
                    reject(err)
                }
                let redAllianceOurs = 0
                let blueAllianceOurs = 0
                let redEPA = 0
                let blueEPA = 0
                for (let i = 0; i < rows.length; i += 1) {
                    let temp = new totalScore(rows[i].teamNumber)
                    await temp.runAnalysis()
                    let tempEPAPoints = 0
                    Manager.db.all(getEPASQL, [rows[i].teamNumber], (err, rows))
                    {
                        if(err)
                        {
                            console.log(err)
                            reject(err)
                        }
                        tempEPAPoints = rows[0].epa
                    }
                    if(i <3)
                    {
                        redAllianceOurs += temp.finalizeResults().result
                        redEPA += tempEPAPoints
                    }
                    else
                    {
                        blueAllianceOurs += temp.finalizeResults().result
                        blueEPA += tempEPAPoints

                    }
                }
                Manager.db.all(getTeamsSQL, [matchNumber], async (err, rows) => {

                })
                resolve("done")
            })
        })

    }
}

module.exports = updatePredictions