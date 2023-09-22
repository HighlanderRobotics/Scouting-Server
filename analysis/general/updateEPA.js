const { forEach, row, resolve, bellNumbers } = require('mathjs')
const BaseAnalysis = require('../BaseAnalysis.js')
const totalScore = require('./averageScorePicklist.js')
const { error } = require('qrcode-terminal')
const GetTeams = require('../../manager/GetTeams.js')
class updateEPA extends BaseAnalysis {
    static name = `updateEPA`

    constructor(db, matchNumber) {
        super(db)
        this.matchNumber = matchNumber
        this.notes = []

    }
    async analysis() {
        let a = this
        try {


            return new Promise(function (resolve, reject) {
                var sql = `SELECT data.matchKey, data.scoutReport, matches.teamKey 
                FROM data
                
                JOIN matches ON matches.key = data.matchKey
                WHERE matches.matchNumber = ? AND matches.matchType = "qm" 
                LIMIT 6`
                let redTotal = 0
                let blueTotal = 0
                let redEPA = 0
                let blueEPA = 0
                a.db.all(sql, [a.matchNumber], async (err, rows) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    else {
                        for (let i = 0; i < rows.length; i++) {
                            let data = JSON.parse(rows[i].scoutReport)
                            let total = 0

                            if (data.autoChallengeResult === 1) {
                                total += 8
                            }
                            else if (data.autoChallengeResult === 2) {
                                total += 12
                            }
                            else if (data.autoChallengeResult === 4) {
                                total += 3
                            }

                            if (data.challengeResult === 1) {
                                total += 6
                            }
                            else if (data.challengeResult === 2) {
                                total += 10
                            }
                            else if (data.challengeResult === 2) {
                                total += 2
                            }




                            let arr = data.events
                            for (let i = 0; i < arr.length; i++) {

                                const entry = arr[i];
                                let max = Math.ceil(entry[2] / 3)
                                if (entry[0] < 17 && entry[1] === 2) {
                                    if (max === 3) {
                                        total += 6
                                    }
                                    if (max === 2) {
                                        total += 4
                                    }
                                    if (max === 1) {
                                        total += 3
                                    }
                                }
                                else if (entry[1] === 2 && entry[0] >= 17) {
                                    if (max === 3) {
                                        total += 5
                                    }
                                    if (max === 2) {
                                        total += 3
                                    }
                                    if (max === 1) {
                                        total += 2
                                    }
                                }

                            }
                            let team = await a.getTeam(rows[i].matchKey)
                            if (i <= 2) {
                                redTotal += total
                                redEPA += await a.getEPA(team)
                            }
                            else {
                                blueTotal += total
                                blueEPA += await a.getEPA(team)

                            }
                        }
                        let actualScoreMarginRed = redTotal - blueTotal
                        let predictedScoreMarginRed = redEPA - blueEPA
                        let updateRed = (72 / 250) * (actualScoreMarginRed - predictedScoreMarginRed)

                        let actualScoreMarginBlue = blueTotal - redTotal
                        let predictedScoreMarginBlue = blueEPA - redEPA
                        let updateBlue = (72 / 250) * (actualScoreMarginBlue - predictedScoreMarginBlue)

                        for (let i = 0; i < rows.length; i++) {
                            if(i <= 2)
                            {
                                let team = await a.getTeam(rows[i].matchKey)
                                await a.updateTeamEPA(team, updateRed)    
                            }
                            else
                            {
                                let team = await a.getTeam(rows[i].matchKey)
                                await a.updateTeamEPA(team, updateBlue)    
                            }
                       
                        }
                        resolve("done")
                    }
                })
            })
        }
        catch (err) {
            console.log(err)
            reject(err)
        }



    }
    async updateTeamEPA(teamNumber, epaChange) {
        let a = this
        var del = `DELETE FROM epaTable WHERE team = ?`
        var add = `INSERT INTO epaTable (team, epa) VALUES (?, ?)`
        let epa = await a.getEPA(teamNumber)
        a.db.all(del, [teamNumber], async (err, rowD) => {
            if (err) {
                console.log(err)
            }
            else {

                a.db.all(add, [teamNumber, epa + epaChange], async (err, rowA) => {
                    if (err) {
                        console.log(err)
                    }
                })




            }
        })

    }
    async getTeam(matchKey) {
        let a = this
        var sql = `SELECT teamKey 
        FROM matches
        WHERE key = ?`
        return new Promise((resolve, reject) => {

            a.db.all(sql, [matchKey], (err, rows) => {
                if (err) {
                    console.log(err)
                }
                else if (rows == undefined) {
                    console.log("cannot find team for match " + matchKey)
                }
                else {
                    let x = rows[0].teamKey.substring(3)
                    resolve(x)
                    return x
                }

            })
        })
    }
    async getEPA(team) {
        let a = this
        return new Promise((resolve, reject) => {
            var getEPASQL = `SELECT epa
                        FROM epaTable
                        WHERE team = ?`

            a.db.all(getEPASQL, [team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else if (rows === undefined || rows.length === 0) {
                    console.log("cannot find epa for team " + team)
                    resolve(null)

                }
                else {
                    resolve(rows[0].epa)
                    return rows[0].epa
                }
            })
        })

    }

    runAnalysis() {
        let a = this
        return new Promise(async (resolve, reject) => {
            await a.analysis().catch((err) => {
                if (err) {
                    return err
                }
            })
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.notes,
            "team": this.team
        }
    }
}
module.exports = updateEPA