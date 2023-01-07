const Manager = require('./Manager.js')

class MatchesCompleted extends Manager {
    static name = "matchesCompleted"

    constructor() {
        super()
    }

    async runTask(body) {
        let sql = `SELECT key FROM matches
        INNER JOIN data ON matches.key = data.matchKey
        WHERE `

        if (body.teamKey) {
            sql += `matches.teamKey = '${body.teamKey}'`
        } else if (body.teamNumber) {
            sql += `matches.teamKey = 'frc${body.teamNumber}'`
        } else {
            return `Missing teamKey or teamNumber`
        }

        if (body.tournamentKey) {
            sql += ` AND matches.gameKey = '${body.tournamentKey}'`
        }

        let returnData = []

        return new Promise((resolve, reject) => {
            Manager.db.all(sql, (err, playedMatches) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }

                playedMatches.forEach(matchKey => {
                    if (!returnData.includes(matchKey.key)) {
                        returnData.push(matchKey.key)
                    }
                })
                resolve(returnData)
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
}

module.exports = MatchesCompleted