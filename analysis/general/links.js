const { boolean, to, count, resolve } = require('mathjs')
const BaseAnalysis = require('../BaseAnalysis.js')
//average links the team makes per match
// (teams cargo/total cargo in match) * lionks scored

class links extends BaseAnalysis {
    static name = `links`

    constructor(db, team) {
        super(db)
        this.average = 0
        this.team = team

    }
    async getAccuracy() {
        let a = this
        let arr = []
        let matches = []
        let sql = `SELECT newMatches.key, newMatches.tournamentKey, newMatches.matchNumber, newMatches.matchType, data.scoutReport
                   FROM data
                   JOIN (SELECT matches.key AS key, matches.tournamentKey, matches.matchNumber, matches.matchType
                      FROM matches 
                      JOIN teams ON teams.key = matches.teamKey
                      WHERE teams.teamNumber = ?) AS newMatches ON data.matchKey = newMatches.key`
        let sql2 = `SELECT scoutReport, newMatches.key AS key
                    FROM data
                    JOIN (SELECT matches.key AS key
                          FROM matches
                          WHERE matches.matchNumber = ? )
                         AS newMatches ON data.matchKey = newMatches.key `
        let rows = await new Promise((resolve, reject) => {
            a.db.all(sql, [a.team], (err, rows) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(rows)
            })
        })
        await Promise.all(rows.map(async (row) => {
            let rows2 = await new Promise((resolve, reject) => {
                a.db.all(sql2, [row.matchNumber], (err, rows2) => {
                    if (err) {
                        console.log(err)
                        reject(err)
                    }
                    resolve(rows2)
                })
            })
            let total = 0
            let low = false
            let currKey = row.key
            if (currKey.substring(row.key.length - 1) <= 2) {
                low = true
            }
            let teamTotal = 0
            let parsedTeam = JSON.parse(row.scoutReport).events
            for (let z = 0; z < parsedTeam.length; z++) {
                if (parsedTeam[z][1] === 2) {
                    teamTotal += 1
                }
            }
            for (let j = 0; j < rows2.length; j++) {
                if (rows2[j].key.substring(rows2[j].key.length - 1) <= 2 == low) {
                    let curr = JSON.parse(rows2[j].scoutReport).events
                    for (let x = 0; x < curr.length; x++) {
                        if (curr[x][1] === 2) {
                            total += 1
                        }
                    }
                }
            }
            let muilt = teamTotal / total
            arr.push(JSON.parse(row.scoutReport).links * muilt)
            matches.push(row.key)
        }))
        a.array = arr.map((item, index) => ({
            "match": matches[index],
            "value": item,
        }))
        a.average = arr.reduce((partialSum, a) => partialSum + a, 0) / arr.length
        if (isNaN(a.average)) {
            a.average = 0
        }
        resolve("done")
    }


    runAnalysis() {

        return new Promise(async (resolve, reject) => {
            let a = this

            var temp = await a.getAccuracy().catch((err) => {
                if (err) {
                    return err
                }
            })
            // a.result = temp  
            resolve("done")
        })

    }
    finalizeResults() {
        return {
            "result": this.average,
            "array": this.array,
            "team": this.team
        }
    }

}
module.exports = links
